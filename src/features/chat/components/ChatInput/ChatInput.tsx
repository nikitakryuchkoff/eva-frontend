import { useEffect, useRef, useState, useCallback, type KeyboardEvent, type MouseEvent } from 'react';

import classNames from 'classnames';
import { AtSign, Paperclip, Mic, Send } from 'lucide-react';

import { Integration, Integrations } from '@/enitites/integration';
import { Select, Tooltip } from '@/shared/ui';

import styles from './ChatInput.module.css';
import { useMention } from '../../hooks';
import { UserList } from '../UserList/UserList';

interface InputAreaProps {
  onSend: (message: string, files?: File[]) => void;
  integrations: Integrations;
  currentIntegration: Integration | null;
  onIntegrationChange: (value: Integration) => void;
  isIntegrationsLoading?: boolean;
  disabled?: boolean;
  statusText?: string;
  helperText?: string;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  [index: number]: { transcript: string };
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

type SpeechRecognitionErrorEvent = Event & { error: string };

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

type VoiceMode = 'speech' | 'recorder' | 'none';

const ARC_UA_PATTERN = /\bArc\/\d+/i;

const isArcBrowser = () => {
  if (typeof window === 'undefined') return false;

  if (ARC_UA_PATTERN.test(window.navigator.userAgent ?? '')) {
    return true;
  }

  if (typeof document === 'undefined') return false;

  const arcPalette = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--arc-palette-background')
    .trim();

  return arcPalette.length > 0;
};

export const ChatInput = ({
  onSend,
  integrations,
  currentIntegration,
  onIntegrationChange,
  isIntegrationsLoading = false,
  disabled,
}: InputAreaProps) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isMentionVisible, setIsMentionVisible] = useState(false);
  const [isMentionClosing, setIsMentionClosing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isArcDetected, setIsArcDetected] = useState(() => isArcBrowser());
  const [voiceMode, setVoiceMode] = useState<VoiceMode>(() => {
    if (isArcBrowser()) return 'none';
    if (window.SpeechRecognition || window.webkitSpeechRecognition) return 'speech';
    if (typeof MediaRecorder !== 'undefined') return 'recorder';
    return 'none';
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const {
    close,
    handleChange,
    isOpen,
    employees,
    activeIndex,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    selectEmployee,
    query,
  } = useMention({
    textareaRef,
  });

  const onChange = (newValue: string) => {
    setValue(newValue);
    const cursorPos = textareaRef.current?.selectionStart ?? newValue.length;
    handleChange(newValue, cursorPos);
  };

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue('');
      close();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const hasValue = value.trim().length > 0;

  const handleInputWrapMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const target = event.target as HTMLElement;
    if (target.closest('[data-chat-footer]')) {
      return;
    }

    event.preventDefault();

    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    const cursorPos = textarea.value.length;
    textarea.setSelectionRange(cursorPos, cursorPos);
  };

  const baseTextRef = useRef('');
  const valueRef = useRef(value);
  valueRef.current = value;
  const onSendRef = useRef(onSend);
  onSendRef.current = onSend;
  const stoppingRef = useRef(false);
  const startedAtRef = useRef(0);
  const pendingRef = useRef(false);

  const startMediaRecording = useCallback(async () => {
    pendingRef.current = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      });

      recorder.addEventListener('stop', () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        const ext = (recorder.mimeType || '').includes('webm') ? 'webm' : 'ogg';
        const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: blob.type });
        onSendRef.current('', [file]);
        mediaRecorderRef.current = null;
      });

      recorder.start();
      mediaRecorderRef.current = recorder;
      pendingRef.current = false;
      setIsRecording(true);
    } catch {
      pendingRef.current = false;
      setIsRecording(false);
      setVoiceMode('none');
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (pendingRef.current) return;
    if (isArcDetected || voiceMode === 'none') return;

    if (isRecording) {
      stoppingRef.current = true;
      if (voiceMode === 'speech') {
        recognitionRef.current?.stop();
      } else {
        mediaRecorderRef.current?.stop();
      }
      setIsRecording(false);
      return;
    }

    // MediaRecorder mode — record audio and send as file
    if (voiceMode === 'recorder') {
      startMediaRecording();
      return;
    }

    // Speech-to-text mode
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (typeof MediaRecorder !== 'undefined') {
        setVoiceMode('recorder');
        startMediaRecording();
      } else {
        setVoiceMode('none');
      }
      return;
    }

    baseTextRef.current = valueRef.current;
    stoppingRef.current = false;
    pendingRef.current = true;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ru-RU';

    let alive = false;

    recognition.addEventListener('start', () => {
      alive = true;
    });

    recognition.addEventListener('result', ((event: Event) => {
      const e = event as unknown as SpeechRecognitionEvent;
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < e.results.length; i++) {
        const result = e.results[i];
        if (!result?.[0]) continue;
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const full = finalTranscript + interimTranscript;
      const base = baseTextRef.current;
      const newVal = base ? `${base} ${full}` : full;
      setValue(newVal);

      setTimeout(() => {
        const ta = textareaRef.current;
        if (ta) {
          ta.focus();
          ta.setSelectionRange(newVal.length, newVal.length);
        }
      }, 0);
    }) as EventListener);

    recognition.addEventListener('error', (() => {
      stoppingRef.current = true;
      pendingRef.current = false;
      setIsRecording(false);
      recognitionRef.current = null;
    }) as EventListener);

    recognition.addEventListener('end', () => {
      pendingRef.current = false;
      if (!stoppingRef.current) {
        const elapsed = Date.now() - startedAtRef.current;
        if (elapsed < 500) {
          setIsRecording(false);
          recognitionRef.current = null;
          return;
        }
        try {
          recognition.start();
          startedAtRef.current = Date.now();
          return;
        } catch {
          /* ignore */
        }
      }
      setIsRecording(false);
      recognitionRef.current = null;
    });

    recognitionRef.current = recognition;

    try {
      recognition.start();
      startedAtRef.current = Date.now();
      pendingRef.current = false;
      setIsRecording(true);
    } catch {
      pendingRef.current = false;
      setIsRecording(false);
      return;
    }

    // Fallback: if browser has the API but it's dead (e.g. Arc), switch to MediaRecorder
    setTimeout(() => {
      if (!alive && recognitionRef.current === recognition) {
        stoppingRef.current = true;
        recognition.abort();
        recognitionRef.current = null;

        if (typeof MediaRecorder !== 'undefined') {
          setVoiceMode('recorder');
          startMediaRecording();
        } else {
          setVoiceMode('none');
          setIsRecording(false);
        }
      }
    }, 2000);
  }, [isRecording, isArcDetected, voiceMode, startMediaRecording]);

  useEffect(() => {
    const detectTimer = window.setTimeout(() => {
      if (!isArcBrowser()) return;

      setIsArcDetected(true);
      setVoiceMode('none');
      setIsRecording(false);
      stoppingRef.current = true;
      recognitionRef.current?.abort();

      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    }, 1200);

    return () => window.clearTimeout(detectTimer);
  }, []);

  useEffect(() => {
    if (!isArcDetected) return;
    setVoiceMode('none');
  }, [isArcDetected]);

  useEffect(() => {
    return () => {
      stoppingRef.current = true;
      recognitionRef.current?.abort();
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsMentionVisible(true);
      setIsMentionClosing(false);
      return;
    }

    if (!isMentionVisible) return;

    setIsMentionClosing(true);
    const timer = setTimeout(() => {
      setIsMentionVisible(false);
      setIsMentionClosing(false);
    }, 220);

    return () => clearTimeout(timer);
  }, [isOpen, isMentionVisible]);

  const innerClassName = classNames(
    styles.inner,
    isFocused && styles.innerFocused,
    disabled && styles.innerDisabled,
  );
  const showMicButton = voiceMode !== 'none' || isArcDetected;
  const micButton = (
    <button
      type="button"
      className={classNames(styles.micButton, isRecording && styles.micRecording)}
      onClick={toggleRecording}
      disabled={disabled || isArcDetected}
      aria-label={
        isArcDetected ? 'Голосовой ввод недоступен в Arc' : isRecording ? 'Остановить запись' : 'Голосовой ввод'
      }
    >
      <Mic size={16} />
    </button>
  );

  return (
    <div className={styles.wrapper}>
      <div className={innerClassName}>
        {isMentionVisible && (
          <UserList
            employees={employees}
            activeIndex={activeIndex}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            onSelect={selectEmployee}
            query={query}
            isClosing={isMentionClosing}
          />
        )}

        <div className={styles.inputWrap} onMouseDown={handleInputWrapMouseDown}>
          {!value && !isFocused && <span className={styles.placeholder}>Напишите сообщение</span>}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            rows={1}
            className={styles.textarea}
          />
          <div className={styles.inputFooter} data-chat-footer>
            <div className={styles.footerLeft}>
              <button type="button" className={styles.composerIcon} aria-label="Упомянуть">
                <AtSign size={18} />
              </button>
              <button type="button" className={styles.composerIcon} aria-label="Прикрепить файл">
                <Paperclip size={16} />
              </button>

              <div className={styles.integrationControl}>
                <Select
                  options={integrations}
                  value={currentIntegration}
                  onChange={onIntegrationChange}
                  showStatus={false}
                  isLoading={isIntegrationsLoading}
                  disabled={Boolean(disabled)}
                  align="start"
                  sideOffset={6}
                  triggerClassName={styles.integrationTrigger ?? ''}
                  contentClassName={styles.integrationContent ?? ''}
                />
              </div>
            </div>

            <div className={styles.sendGroup}>
              {showMicButton && (
                isArcDetected ? (
                  <Tooltip content="Голосовой ввод в Arc работает нестабильно и отключён. Используйте Chrome.">
                    {micButton}
                  </Tooltip>
                ) : (
                  micButton
                )
              )}
              <button
                type="button"
                className={classNames(styles.sendButton, hasValue && styles.animateIn)}
                onClick={handleSend}
                disabled={disabled || !hasValue}
                aria-label="Отправить"
              >
                <Send className={styles.sendIcon} />
                <span className={styles.srOnly}>Отправить</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
