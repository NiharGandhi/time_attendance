import React, { useEffect, useState } from 'react'
import LeaveCards from '../cards/LeaveCards'
import axios from 'axios'
import { Shifts } from "@prisma/client"
import ShiftCards from '../cards/ShiftCard'

const ShiftPolicy = () => {

    const [allshift, setAllShift] = useState<Shifts[]>([]);

    useEffect(() => {
        fetchAllLeaves();
    }, []);

    const fetchAllLeaves = async () => {
        const response = await axios.get('/api/getAllShifts');
        setAllShift(response.data);
        console.log(response.data);
    }

    return (
        <div>
            <div className="my-2 grid grid-cols-1 xl:grid-cols-2 gap-4">
                {allshift.map((shift, index) => (
                    <ShiftCards
                        key={index}
                        id={shift.id}
                        shiftTitle={shift.shiftTitle}
                        shiftDescription={shift.shiftDescription}
                        shiftStartDate={shift.shiftStartDate}
                        shiftEndDate={shift.shiftEndDate}
                        shiftEndTime={shift.shiftEndTime}
                        shiftStartTime={shift.shiftStartTime}
                        deptName={shift.department.departmentName}
                    />
                ))}
            </div>
        </div>
    )
}

export default ShiftPolicy