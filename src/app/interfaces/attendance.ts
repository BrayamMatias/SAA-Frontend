export interface Attendance {
    id?: number;
    teacher_id: number;
    student_id: number;
    learn_unit_id: number;
    date: string;
    attendance: [string];
}