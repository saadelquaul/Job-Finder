import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Application, ApplicationStatus } from '../../../../core/models/applications.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-application-card',
  imports: [FormsModule, DatePipe],
  templateUrl: './application-card.html',
  styleUrl: './application-card.css',
})
export class ApplicationCard {
  @Input() application!: Application;
  @Output() update = new EventEmitter<Application>();
  @Output() remove = new EventEmitter<number>();

  editingNotes = signal<boolean>(false);
  editedNotes = signal<string>('');

  get statusLabel(): string {
    switch (this.application.status) {
      case 'en_attente': return 'En attente';
      case 'accepte': return 'Accepté';
      case 'refuse': return 'Refusé';
      default: return this.application.status;
    }
  }

  get statusClass(): string {
    switch (this.application.status) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-700';
      case 'accepte': return 'bg-green-100 text-green-700';
      case 'refuse': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  changeStatus(status: ApplicationStatus): void {
    this.update.emit({ ...this.application, status });
    this.application.status = status;
  }

  startEditingNotes(): void {
    this.editingNotes.set(true);
    this.editedNotes.set(this.application.notes);
  }

  saveNotes(): void {
    this.editingNotes.set(false);
    this.update.emit({ ...this.application, notes: this.editedNotes() });
    this.application.notes = this.editedNotes();
  }

  cancelEditingNotes(): void {
    this.editingNotes.set(false);
  }

  onRemove(): void {
    if (this.application.id) {
      this.remove.emit(this.application.id);
    }
  }
}
