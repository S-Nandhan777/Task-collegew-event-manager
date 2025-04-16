import styles from '../styles/ShareButton.module.css';

export default function ShareButton({ eventId }: { eventId: number }) {
  const handleShare = () => {
    const url = `${window.location.origin}/event/${eventId}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Event URL copied to clipboard!');
    });
  };

  return (
    <button onClick={handleShare} className={styles.shareButton}>
      Share
    </button>
  );
}