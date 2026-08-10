import { IStudent } from '../interfaces/student.interface';

let students: IStudent[] = [];
let idCounter = 1;

export const StudentModel = {
  getAll(): IStudent[] {
    return students.filter((s) => !s.isDeleted);
  },

  getById(id: number): IStudent | undefined {
    return students.find((s) => s.id === id && !s.isDeleted);
  },

  findByEmail(email: string): IStudent | undefined {
    return students.find((s) => s.email.toLowerCase() === email.toLowerCase() && !s.isDeleted);
  },

  findByPhone(phone: string): IStudent | undefined {
    return students.find((s) => s.phone === phone && !s.isDeleted);
  },

  create(data: Omit<IStudent, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt'>): IStudent {
    const student: IStudent = {
      id: idCounter++,
      ...data,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    students.push(student);
    return student;
  },

  update(id: number, data: Partial<IStudent>): IStudent | undefined {
    const index = students.findIndex((s) => s.id === id && !s.isDeleted);
    if (index === -1) return undefined;
    students[index] = { ...students[index], ...data, updatedAt: new Date() };
    return students[index];
  },

  softDelete(id: number): boolean {
    const index = students.findIndex((s) => s.id === id && !s.isDeleted);
    if (index === -1) return false;
    students[index].isDeleted = true;
    students[index].updatedAt = new Date();
    return true;
  },

  seed(initialStudents: Omit<IStudent, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt'>[]): void {
    if (students.length === 0) {
      initialStudents.forEach((s) => this.create(s));
    }
  },

  clear(): void {
    students = [];
    idCounter = 1;
  },
};
