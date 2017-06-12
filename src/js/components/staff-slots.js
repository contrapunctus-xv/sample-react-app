import dateFormat from 'dateformat';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
    TIME_SLOT_SELECTED
} from 'src/js/action-types';
import { getYYYYMMDDPath } from 'src/js/utils/date';
import { Slot } from './slot';

export const StaffSlots = (
        { date, id, slots, slotForm, router, dispatch, style }
    ) => {
    const formattedDate = dateFormat(date, 'dddd, d mmm yyyy');

    const timeClick = time => () => {
        dispatch(
            {
                type: TIME_SLOT_SELECTED,
                slotTime: time,
                slotType: slotForm === 'start' ? 'startTime' : 'endTime'
            }
        );
        let action = 'book';
        if (slotForm === 'start')
            action = 'end';
        router.push(`/staff/${id}/available_slots/${getYYYYMMDDPath(date)}/${action}`);
    };
    return (
      <div className="staff-slots" style={style}>
        <div className="staff-slots-date">{formattedDate}</div>
        {
            slots.length ?
              <div>
                <p className="staff-slots-message">{ `Choose your ${slotForm} time`}</p>
                <ul className="staff-slots-times">
                  {
                      slots.map((time, index) => (
                        <Slot
                            time={time}
                            key={`slot ${time}`}
                            index={index}
                            timeClick={timeClick}
                        />
                      ))
                  }
                </ul>
              </div>
              :
              <p className="staff-slots-message">No slots available!</p>
        }
      </div>
    );
};

StaffSlots.defaultProps = {
    startTime: '',
    duration: 0
};

StaffSlots.propTypes = {
    date: PropTypes.object.isRequired,
    slots: PropTypes.array.isRequired,
    slotForm: PropTypes.string.isRequired,
    router: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired
};


const mapStateToProps = (
    {
        staff: {
            selectedStaffMember: {
                id, selectedDate, slotsForDate, slotForm
            },
            duration
        }
    }) => ({
        date: selectedDate,
        slots: slotsForDate,
        duration,
        slotForm,
        id
    });

export default connect(mapStateToProps)(StaffSlots);
