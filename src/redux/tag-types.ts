export enum tagTypes {
  user = "user",
  product = "product",
  cart = "cart",
  categories = "categories",


  //! will remove later
  department = "department",
  faculty = "faculty",
  admin = "admin",
  student = "student",
  academicFaculty = "academic-faculty",
  academicDepartment = "academic-department",
  academicSemester = "academic-semester",
  building = "building",
  room = "room",
  course = "course",
  semesterRegistration = "semester-registration",
  offeredCourse = "offered-course",
  offeredCourseSection = "offered-course-section",
  offeredCourseSchedule = "offered-course-schedule",
  courseRegistration = "course-registration",
}

export const tagTypesList = [
  tagTypes.user,
  tagTypes.product,
  tagTypes.cart,
  tagTypes.categories,


  //! will remove later
  tagTypes.department,
  tagTypes.faculty,
  tagTypes.admin,
  tagTypes.student,
  tagTypes.academicFaculty,
  tagTypes.academicDepartment,
  tagTypes.academicSemester,
  tagTypes.building,
  tagTypes.room,
  tagTypes.course,
  tagTypes.semesterRegistration,
  tagTypes.offeredCourse,
  tagTypes.offeredCourseSection,
  tagTypes.offeredCourseSchedule,
  tagTypes.courseRegistration,
];
