import { EventForm } from '@/features/event/components/EventForm';

export default function NewEventPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-xs tracking-[0.2em] text-panggung uppercase">Mulai dari draf</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">Buat event</h1>
        <p className="mt-1 text-sm text-tinta-soft">
          Isi detail di bawah ini. Event tersimpan sebagai draf — tayangkan saat sudah siap.
        </p>
      </div>
      <EventForm />
    </div>
  );
}
