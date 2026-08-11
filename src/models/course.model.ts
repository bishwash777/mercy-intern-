import { ICourse } from '../interfaces/course.interface';

let courses: ICourse[] = [];
let idCounter = 1;

export const CourseModel = {
  getAll(): ICourse[] {
    return courses.filter((c) => !c.isDeleted);
  },

  getById(id: number): ICourse | undefined {
    return courses.find((c) => c.id === id && !c.isDeleted);
  },

  create(data: Omit<ICourse, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt'>): ICourse {
    const course: ICourse = {
      id: idCounter++,
      ...data,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    courses.push(course);
    return course;
  },

  update(id: number, data: Partial<ICourse>): ICourse | undefined {
    const index = courses.findIndex((c) => c.id === id && !c.isDeleted);
    if (index === -1) return undefined;
    courses[index] = { ...courses[index], ...data, updatedAt: new Date() };
    return courses[index];
  },

  softDelete(id: number): boolean {
    const index = courses.findIndex((c) => c.id === id && !c.isDeleted);
    if (index === -1) return false;
    courses[index].isDeleted = true;
    courses[index].updatedAt = new Date();
    return true;
  },

  seed(initialCourses: Omit<ICourse, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt'>[]): void {
    if (courses.length === 0) {
      initialCourses.forEach((c) => this.create(c));
    }
  },

  clear(): void {
    courses = [];
    idCounter = 1;
  },
};
