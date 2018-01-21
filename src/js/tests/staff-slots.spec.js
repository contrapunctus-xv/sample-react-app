import { expect } from 'chai';
import dateFormat from 'dateformat';
import React from 'react';
import renderShallow from 'render-shallow';
import { spy } from 'sinon';
import moment from 'moment';
import noop from 'lib/util/noop';
import { createNew } from 'src/js/store';
import { initialState } from 'src/js/reducers/staff';
import { findAllWithType } from 'react-shallow-testutils';
import { TIME_SLOT_SELECTED } from 'src/js/action-types';
import { getYYYYMMDDPath } from 'src/js/utils/date';
import StaffSlotsConnected, { StaffSlots } from '../components/staff-slots';
import Slot from '../components/slot';

describe('<StaffSlots>', () => {
    context('when rendered with slots', () => {
        let component;

        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const slots = ['7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM'];
        const timeClick = () => noop;
        const id = 'c278c21e-fed8-11e7-8be5-0ed5f89f718b';
        const props = {
            date: currentDate,
            router: {},
            slots,
            dispatch: noop,
            slotForm: 'start',
            id,
            style: { styleAttr: 'some-style' },
            bookingsForDate: []
        };

        before(() => {
            component = renderShallow(<StaffSlots {...props} />).output;
        });

        it('renders staff slots', () => {
            expect(component).to.eql(
              <div className="staff-slots" style={props.style}>

                <div className="staff-slots-date">{formattedDate}</div>
                <div>
                  <p className="staff-slots-message">Choose your start time</p>
                  <ul className="staff-slots-times">
                    {
                          slots.map((time, index) => (
                            <Slot
                                time={time}
                                key={`slot ${time}`}
                                index={index}
                                timeClick={timeClick}
                                disabled={false}
                            />
                          ))
                      }
                  </ul>
                </div>
              </div>
            );
        });
    });

    context('when rendered with slots with colliding bookings for start time selection', () => {
        let component;

        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const collidingSlot = '7:00 AM';
        const slots = [collidingSlot, '7:15 AM', '7:30 AM', '7:45 AM'];
        const timeClick = () => noop;
        const id = 'c81e5346-fed8-11e7-8be5-0ed5f89f718b';
        const props = {
            date: currentDate,
            router: {},
            slots,
            dispatch: noop,
            slotForm: 'start',
            id,
            style: { styleAttr: 'some-style' },
            bookingsForDate: [{
                startTime: collidingSlot,
                endTime: '8:00 AM'
            }]
        };

        before(() => {
            component = renderShallow(<StaffSlots {...props} />).output;
        });

        it('renders staff slots without anything disabled', () => {
            expect(component).to.eql(
              <div className="staff-slots" style={props.style}>

                <div className="staff-slots-date">{formattedDate}</div>
                <div>
                  <p className="staff-slots-message">Choose your start time</p>
                  <ul className="staff-slots-times">
                    <Slot
                        time={collidingSlot}
                        key={`slot ${collidingSlot}`}
                        index={0}
                        timeClick={timeClick}
                        disabled
                    />
                    {
                                slots.slice(1).map((time, index) => (
                                  <Slot
                                      time={time}
                                      key={`slot ${time}`}
                                      index={index + 1}
                                      timeClick={timeClick}
                                      disabled={false}
                                  />
                                ))
                            }
                  </ul>
                </div>
              </div>
            );
        });
    });

    context('when rendered with slots with colliding bookings for end time selection', () => {
        let component;

        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const collidingSlot = '7:00 AM';
        const slots = [collidingSlot, '7:15 AM', '7:30 AM', '7:45 AM'];
        const timeClick = () => noop;
        const id = 'ce8726ae-fed8-11e7-8be5-0ed5f89f718b';
        const props = {
            date: currentDate,
            router: {},
            slots,
            dispatch: noop,
            slotForm: 'end',
            id,
            style: { styleAttr: 'some-style' },
            bookingsForDate: [{
                startTime: '6:00 AM',
                endTime: collidingSlot
            }]
        };

        before(() => {
            component = renderShallow(<StaffSlots {...props} />).output;
        });

        it('renders staff slots without anything disabled', () => {
            expect(component).to.eql(
              <div className="staff-slots" style={props.style}>

                <div className="staff-slots-date">{formattedDate}</div>
                <div>
                  <p className="staff-slots-message">Choose your end time</p>
                  <ul className="staff-slots-times">
                    <Slot
                        time={collidingSlot}
                        key={`slot ${collidingSlot}`}
                        index={0}
                        timeClick={timeClick}
                        disabled
                    />
                    {
                                slots.slice(1).map((time, index) => (
                                  <Slot
                                      time={time}
                                      key={`slot ${time}`}
                                      index={index + 1}
                                      timeClick={timeClick}
                                      disabled={false}
                                  />
                                ))
                            }
                  </ul>
                </div>
              </div>
            );
        });
    });

    context('when rendered with slots without colliding bookings', () => {
        let component;

        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const slots = ['7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM'];
        const timeClick = () => noop;
        const id = 'd35a6f2e-fed8-11e7-8be5-0ed5f89f718b';
        const props = {
            date: currentDate,
            router: {},
            slots,
            dispatch: noop,
            slotForm: 'start',
            id,
            style: { styleAttr: 'some-style' },
            bookingsForDate: [{
                startTime: '6:00 AM',
                endTime: '7:00 AM'
            }]
        };

        before(() => {
            component = renderShallow(<StaffSlots {...props} />).output;
        });

        it('renders staff slots without anything disabled', () => {
            expect(component).to.eql(
              <div className="staff-slots" style={props.style}>

                <div className="staff-slots-date">{formattedDate}</div>
                <div>
                  <p className="staff-slots-message">Choose your start time</p>
                  <ul className="staff-slots-times">
                    {
                                slots.map((time, index) => (
                                  <Slot
                                      time={time}
                                      key={`slot ${time}`}
                                      index={index}
                                      timeClick={timeClick}
                                      disabled={false}
                                  />
                                ))
                            }
                  </ul>
                </div>
              </div>
            );
        });
    });

    context('when slots are empty', () => {
        let component;

        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const slots = [];
        const id = 'd78655b8-fed8-11e7-8be5-0ed5f89f718b';
        const props = {
            date: currentDate,
            router: {},
            slots,
            slotForm: 'start',
            dispatch: noop,
            id,
            style: { styleAttr: 'some-style' },
            bookingsForDate: []
        };

        before(() => {
            component = renderShallow(<StaffSlots {...props} />).output;
        });

        it('renders no slots available message', () => {
            expect(component).to.eql(
              <div className="staff-slots" style={props.style}>
                <div className="staff-slots-date">{formattedDate}</div>
                <p className="staff-slots-message">No slots available!</p>
              </div>
            );
        });
    });

    context('when slotForm is type start', () => {
        let component;

        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const slots = ['8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM'];
        const id = 'db624a7a-fed8-11e7-8be5-0ed5f89f718b';
        const props = {
            date: currentDate,
            router: {},
            slots,
            slotForm: 'start',
            dispatch: noop,
            id,
            style: { styleAttr: 'some-style' },
            bookingsForDate: []
        };
        const timeClick = () => noop;

        before(() => {
            component = renderShallow(<StaffSlots {...props} />).output;
        });

        it('renders staff slots with start times', () => {
            expect(component).to.eql(
              <div className="staff-slots" style={props.style}>
                <div className="staff-slots-date">{formattedDate}</div>
                <div>
                  <p className="staff-slots-message">Choose your start time</p>
                  <ul className="staff-slots-times">
                    {
                          slots.map((time, index) => (
                            <Slot
                                time={time}
                                key={`slot ${time}`}
                                index={index}
                                timeClick={timeClick}
                                disabled={false}
                            />
                          ))
                      }
                  </ul>
                </div>
              </div>
            );
        });
    });
    context('when time is clicked and start time is chosen', () => {
        const currentDate = moment();
        const slots = ['8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM'];
        const id = 'dfc342ea-fed8-11e7-8be5-0ed5f89f718b';
        const props = {
            date: currentDate,
            router: {
                push: noop
            },
            dispatch: spy(),
            slots,
            duration: 60,
            slotForm: 'start',
            id,
            style: { styleAttr: 'some-style' },
            bookingsForDate: []
        };

        before(() => {
            const component = renderShallow(<StaffSlots {...props} />).output;
            const firstButton = findAllWithType(component, Slot)[0];
            firstButton.props.timeClick(slots[0], 0)();
        });

        it(`dispatches ${TIME_SLOT_SELECTED}`, () => {
            expect(props.dispatch).to.have.been.calledWith(
                {
                    type: TIME_SLOT_SELECTED,
                    slotTime: slots[0],
                    slotType: 'startTime'
                }
            );
        });
    });

    context('when time is clicked and end time is chosen', () => {
        const currentDate = moment();
        const slots = ['8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM'];
        const id = 'e428c7b0-fed8-11e7-8be5-0ed5f89f718b';
        const props = {
            date: currentDate,
            router: {
                push: spy()
            },
            dispatch: spy(),
            slots,
            duration: 60,
            slotForm: 'end',
            id,
            style: { styleAttr: 'some-style' },
            bookingsForDate: []
        };

        before(() => {
            const component = renderShallow(<StaffSlots {...props} />).output;
            const firstButton = findAllWithType(component, Slot)[0];
            firstButton.props.timeClick(slots[0], 0)();
        });

        it(`dispatches ${TIME_SLOT_SELECTED}`, () => {
            expect(props.dispatch).to.have.been.calledWith(
                {
                    type: TIME_SLOT_SELECTED,
                    slotTime: slots[0],
                    slotType: 'endTime'
                }
            );
        });

        it(`calls router to push to /staff/${id}/book`, () => {
            expect(props.router.push).to.have.been.calledWith(
                `/staff/${id}/available_slots/${getYYYYMMDDPath(currentDate)}/book`
            );
        });
    });

    context('when it is connected', () => {
        let store;
        let component;
        const router = {
            push: noop
        };
        const slots = ['7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM'];
        const currentDate = moment();
        const duration = 60;
        const slotForm = 'start';
        const id = 'e9210d0e-fed8-11e7-8be5-0ed5f89f718b';
        const style = { styleAttribute: 'some-style' };
        const selectedStaffMember = {
            id,
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry',
            availableSlots: [
                {
                    date: currentDate,
                    slots
                }
            ],
            selectedDate: currentDate,
            slotsForDate: slots,
            slotForm,
            bookingsForDate: []
        };

        before(() => {
            store = createNew({ staff: { ...initialState, duration, selectedStaffMember } });
            component = renderShallow(
              <StaffSlotsConnected
                  store={store}
                  router={router}
                  style={style}
              />
            ).output;
        });
        it('renders StaffSlots with store and its dispatch', () => {
            expect(component).to.eql(
              <StaffSlots
                  dispatch={noop}
                  store={store}
                  router={router}
                  slots={slots}
                  slotForm={slotForm}
                  date={currentDate}
                  duration={duration}
                  id={id}
                  style={style}
                  bookingsForDate={[]}
              />
            );
        });
    });
});
