import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearFecha',
})
export class FormatearFechaPipe implements PipeTransform {
  transform(date: string): string {
    const messageDate = new Date(date);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const msgDay = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate(),
    );

    if (msgDay.getTime() === today.getTime()) {
      return messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    if (msgDay.getTime() === yesterday.getTime()) {
      return 'Ayer';
    }

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    if (msgDay >= startOfWeek) {
      const days = [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado',
      ];
      return days[messageDate.getDay()];
    }

    const day = String(messageDate.getDate()).padStart(2, '0');
    const month = String(messageDate.getMonth() + 1).padStart(2, '0');
    const year = messageDate.getFullYear();

    return date ? `${day}/${month}/${year}` : '';
  }
}
