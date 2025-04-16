import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Reminder } from '../types';
import { formatDate } from '../utils/formatDate';
import styles from '../styles/ReminderDropdown.module.css';

export default function ReminderDropdown({ reminders, onClose }: { reminders: Reminder[]; onClose: () => void }) {
  const [adjustedReminders, setAdjustedReminders] = useState<Reminder[]>(reminders);

  const handleAdjustReminder = async (reminderId: number, newTime: string) => {
    try {
      await api.post('/reminders', { event_id: reminderId, reminder_time: newTime });
      const updatedReminders = adjustedReminders.map(r =>
        r.reminder_id === reminderId ? { ...r, reminder_time: newTime } : r
      );
      setAdjustedReminders(updatedReminders);
      toast.success('Reminder time updated');
    } catch (error) {
      toast.error('Failed to update reminder');
    }
  };

  return (
    <div className={styles.reminderDropdown} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeButton} onClick={onClose}>✖</button>
      {adjustedReminders.length ? (
        adjustedReminders.map(reminder => {
          const eventTime = new Date(`${reminder.date} ${reminder.time}`);
          const reminderTime = new Date(reminder.reminder_time || eventTime.getTime() - 60 * 60 * 1000);
          return (
            <div key={reminder.reminder_id} className={styles.reminderItem}>
              <div>{reminder.title}</div>
              <div>Location: {reminder.location}</div>
              <div>Event Time: {formatDate(reminder.date)} {reminder.time}</div>
              <div>Reminder Time: {formatDate(reminderTime.toISOString())} {reminderTime.toLocaleTimeString()}</div>
              <input
                type="datetime-local"
                defaultValue={reminderTime.toISOString().slice(0, 16)}
                onChange={(e) => handleAdjustReminder(reminder.reminder_id, e.target.value)}
                className={styles.timeInput}
              />
            </div>
          );
        })
      ) : (
        <div className={styles.noReminders}>No reminders</div>
      )}
    </div>
  );
}