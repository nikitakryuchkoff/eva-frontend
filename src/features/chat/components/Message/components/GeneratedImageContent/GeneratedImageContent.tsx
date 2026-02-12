import { FC, memo } from 'react';
import styles from './GeneratedImageContent.module.css';
import { MessageTitleRequest } from '@/enitites/message';
import { Button, downloadImage } from '@/shared';
import { DownloadIcon, RefreshCwIcon } from 'lucide-react';
import { useGeneratedImage } from '@/enitites/image';

interface Props {
  request: MessageTitleRequest;
  isLast: boolean;
}

export const GeneratedImageContent: FC<Props> = memo(({ request }) => {
  const { imageData, isLoading, error, refetch } = useGeneratedImage(request);

  if (isLoading) {
    return (
      <div className={styles.skeletonWrapper}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonShimmer} />
        </div>
        <div className={styles.skeletonFooter}>
          <div className={styles.skeletonDot} />
          <div className={styles.skeletonDot} />
          <div className={styles.skeletonDot} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.errorContainer}>
          <span className={styles.errorText}>Изображение не загрузилось</span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className={styles.errorRetryButton}
            aria-label="Повторить загрузку"
            title="Повторить загрузку"
            leftIcon={<RefreshCwIcon />}
            onClick={() => refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.imageWrapper}>
      <div className={styles.imageContainer}>
        <img
          src={`data:${imageData.thumbnailContentType};base64,${imageData?.thumbnail}`}
          alt="Generated"
          className={styles.generatedImage}
          loading="lazy"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className={styles.downloadButton}
          aria-label="Скачать изображение"
          title="Скачать изображение"
          leftIcon={<DownloadIcon />}
          onClick={() => downloadImage(imageData.image, imageData.imageContentType, true)}
        />
      </div>
    </div>
  );
});
