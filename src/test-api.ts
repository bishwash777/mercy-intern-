import http from 'http';
import app from './app';
import { StudentModel } from './models/student.model';
import { CourseModel } from './models/course.model';
import { EnrollmentModel } from './models/enrollment.model';
import { seedInitialData } from './utils/seedData';

async function runTests() {
  console.log('🧪 Starting API Integration Tests...\n');

  // Clear models and re-seed
  StudentModel.clear();
  CourseModel.clear();
  EnrollmentModel.clear();
  seedInitialData();

  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(3099, () => resolve());
  });

  const BASE_URL = 'http://localhost:3099';
  let passed = 0;
  let failed = 0;

  async function assertTest(
    name: string,
    fn: () => Promise<boolean>
  ) {
    try {
      const ok = await fn();
      if (ok) {
        console.log(`✅ [PASS] ${name}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${name}`);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, (err as Error).message);
      failed++;
    }
  }

  // 1. Health Check
  await assertTest('GET /health - Returns 200 OK & server uptime', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    return res.status === 200 && data.success === true && typeof data.uptime === 'number';
  });

  // 2. Initial Seeded Data Check
  await assertTest('GET /api/students - Returns seeded students', async () => {
    const res = await fetch(`${BASE_URL}/api/students`);
    const data = await res.json();
    return res.status === 200 && data.success === true && data.total === 3;
  });

  // 3. Search Students
  await assertTest('GET /api/students?search=alice - Searches student by name', async () => {
    const res = await fetch(`${BASE_URL}/api/students?search=alice`);
    const data = await res.json();
    return res.status === 200 && data.data.length === 1 && data.data[0].name === 'Alice Smith';
  });

  // 4. Create Student Valid
  let createdStudentId = 0;
  await assertTest('POST /api/students - Creates new student successfully', async () => {
    const res = await fetch(`${BASE_URL}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        phone: '+1444333222',
        age: 21,
      }),
    });
    const data = await res.json();
    createdStudentId = data.data?.id;
    return res.status === 201 && data.success === true && data.data.name === 'Charlie Brown';
  });

  // 5. Create Student Duplicate Email (409)
  await assertTest('POST /api/students - Returns 409 Conflict for duplicate email', async () => {
    const res = await fetch(`${BASE_URL}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Person',
        email: 'charlie@example.com',
        phone: '+1999888777',
        age: 22,
      }),
    });
    const data = await res.json();
    return res.status === 409 && data.success === false;
  });

  // 6. Create Student Invalid Age (400)
  await assertTest('POST /api/students - Returns 400 for age under 16', async () => {
    const res = await fetch(`${BASE_URL}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Young Kid',
        email: 'kid@example.com',
        phone: '+1888777666',
        age: 14,
      }),
    });
    const data = await res.json();
    return res.status === 400 && data.success === false && Array.isArray(data.errors);
  });

  // 7. Get Student by ID
  await assertTest('GET /api/students/:id - Returns student details', async () => {
    const res = await fetch(`${BASE_URL}/api/students/${createdStudentId}`);
    const data = await res.json();
    return res.status === 200 && data.data.id === createdStudentId;
  });

  // 8. Update Student
  await assertTest('PUT /api/students/:id - Updates student info', async () => {
    const res = await fetch(`${BASE_URL}/api/students/${createdStudentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Charlie Updated Brown', age: 22 }),
    });
    const data = await res.json();
    return res.status === 200 && data.data.name === 'Charlie Updated Brown';
  });

  // 9. Initial Seeded Courses Check
  await assertTest('GET /api/courses - Returns seeded courses', async () => {
    const res = await fetch(`${BASE_URL}/api/courses`);
    const data = await res.json();
    return res.status === 200 && data.success === true && data.total === 3;
  });

  // 10. Course Search
  await assertTest('GET /api/courses?search=React - Searches course by title', async () => {
    const res = await fetch(`${BASE_URL}/api/courses?search=React`);
    const data = await res.json();
    return res.status === 200 && data.data.length === 1 && data.data[0].title.includes('React');
  });

  // 11. Create Course
  let createdCourseId = 0;
  await assertTest('POST /api/courses - Creates course successfully', async () => {
    const res = await fetch(`${BASE_URL}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Docker & Kubernetes Fundamentals',
        description: 'Learn containerization and orchestration.',
        duration: '5 weeks',
      }),
    });
    const data = await res.json();
    createdCourseId = data.data?.id;
    return res.status === 201 && data.success === true && data.data.title === 'Docker & Kubernetes Fundamentals';
  });

  // 12. Enroll Student in Course
  let createdEnrollmentId = 0;
  await assertTest('POST /api/enrollments - Enrolls student in course', async () => {
    const res = await fetch(`${BASE_URL}/api/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: createdStudentId,
        courseId: createdCourseId,
      }),
    });
    const data = await res.json();
    createdEnrollmentId = data.data?.id;
    return res.status === 201 && data.success === true && data.data.student.id === createdStudentId;
  });

  // 13. Duplicate Enrollment (409)
  await assertTest('POST /api/enrollments - Prevents duplicate enrollment (409)', async () => {
    const res = await fetch(`${BASE_URL}/api/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: createdStudentId,
        courseId: createdCourseId,
      }),
    });
    const data = await res.json();
    return res.status === 409 && data.success === false;
  });

  // 14. Get Courses of Student
  await assertTest('GET /api/students/:id/courses - Returns courses enrolled by student', async () => {
    const res = await fetch(`${BASE_URL}/api/students/${createdStudentId}/courses`);
    const data = await res.json();
    return res.status === 200 && data.data.courses.includes('Docker & Kubernetes Fundamentals');
  });

  // 15. Get Students of Course
  await assertTest('GET /api/courses/:id/students - Returns enrolled students for course', async () => {
    const res = await fetch(`${BASE_URL}/api/courses/${createdCourseId}/students`);
    const data = await res.json();
    return res.status === 200 && data.data.students.some((s: any) => s.id === createdStudentId);
  });

  // 16. Delete Enrollment
  await assertTest('DELETE /api/enrollments/:id - Deletes enrollment successfully', async () => {
    const res = await fetch(`${BASE_URL}/api/enrollments/${createdEnrollmentId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return res.status === 200 && data.success === true;
  });

  // 17. Soft Delete Student & Enrollment Cascade Cleanup
  await assertTest('DELETE /api/students/:id - Soft-deletes student and cascades enrollment cleanup', async () => {
    // Re-enroll student first
    await fetch(`${BASE_URL}/api/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: createdStudentId, courseId: createdCourseId }),
    });

    // Delete student
    const deleteRes = await fetch(`${BASE_URL}/api/students/${createdStudentId}`, {
      method: 'DELETE',
    });

    // Verify student 404
    const getRes = await fetch(`${BASE_URL}/api/students/${createdStudentId}`);

    // Verify course students does not contain soft deleted student
    const courseStudRes = await fetch(`${BASE_URL}/api/courses/${createdCourseId}/students`);
    const courseStudData = await courseStudRes.json();

    return (
      deleteRes.status === 200 &&
      getRes.status === 404 &&
      !courseStudData.data.students.some((s: any) => s.id === createdStudentId)
    );
  });

  server.close();

  console.log('\n========================================');
  console.log(`  Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
