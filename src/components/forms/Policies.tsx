import React, { useEffect, useState } from 'react'
import LeaveCards from '../cards/LeaveCards'
import axios from 'axios'
import { type Leaves } from "@prisma/client"

const LeavePolicy = () => {

    const [allLeave, setAllLeave] = useState<Leaves[]>([]);

    useEffect(() => {
        fetchAllLeaves();
    }, []);

    const fetchAllLeaves = async () => {
        const response = await axios.get('/api/getAllLeaves');
        setAllLeave(response.data);
        console.log(response.data);
    }

    return (
        <div>
            <div className="my-2 grid grid-cols-1 xl:grid-cols-2 gap-4">
                {allLeave.map((leave, index) => (
                    <LeaveCards
                        key={index}
                        id={leave.id}
                        leaveTitle={leave.leaveTitle}
                        leaveDescription={leave.leaveDescription}
                        leaveDays={leave.leaveDays}
                        carryOver={leave.carryOverDays}
                    />
                ))}
            </div>
        </div>
    )
}

export default LeavePolicy