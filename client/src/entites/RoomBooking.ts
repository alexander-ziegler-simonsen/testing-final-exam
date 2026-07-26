export interface RoomBooking {
    id: number
    fkRoomId: number
    startTime: string
    endTime: string
    fkPatientId: number
}
