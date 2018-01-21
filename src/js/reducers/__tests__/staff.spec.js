import { expect } from 'chai';
import {
    SLOTS_FETCHED,
    STAFF_FETCHED,
    DATE_SELECTED,
    CLEAR_SELECTED_STAFF_MEMBER,
    BOOKINGS_FETCHED,
    STAFF_SELECTED,
    IS_LOADING,
    CLEAR_AVAILABLE_SLOTS
} from 'src/js/action-types';
import { createNew } from 'src/js/store';
import { initialState } from 'src/js/reducers/staff';
import moment from 'moment';
import find from 'lodash.find';

describe('staff reducers', () => {
    const staffMembers = [
        {
            id: '0be53230-fef1-11e7-8be5-0ed5f89f718b', // resourceId
            imagePath: 'http://i.pravatar.cc/300?img=69',
            name: 'James Hunter'
        },
        {
            id: '147d30aa-fef1-11e7-8be5-0ed5f89f718b',
            imagePath: 'http://i.pravatar.cc/300?img=25',
            name: 'Selena Yamada'
        },
        {
            id: '1814c926-fef1-11e7-8be5-0ed5f89f718b',
            imagePath: 'http://i.pravatar.cc/300?img=32',
            name: 'Sarah Belmoris'
        },
        {
            id: '1b358118-fef1-11e7-8be5-0ed5f89f718b',
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry'
        }
    ];
    context('when store is initiated', () => {
        let state;
        before(() => {
            const store = createNew();
            state = store.getState().staff;
        });
        it('has the state populated with staff', () => {
            expect(state).to.eql(initialState);
        });
    });

    context(`${STAFF_FETCHED} is dispatched`, () => {
        let state;
        const duration = 60;

        before(() => {
            const store = createNew();
            store.dispatch(
                {
                    type: STAFF_FETCHED,
                    staffMembers,
                    duration
                }
            );
            state = store.getState().staff;
        });

        it('adds fetched staffMembers to the store', () => {
            expect(state).to.eql({
                ...initialState,
                staffMembers,
                duration
            });
        });

    });

    context(`${DATE_SELECTED} is dispatched`, () => {
        context('and there are available slots for that date', () => {
            let state;
            const formattedDate = '2017-04-01';
            const date = moment(formattedDate);
            const selectedStaffMember = {
                id: '1b358118-fef1-11e7-8be5-0ed5f89f718b', // resourceId
                imagePath: 'http://i.pravatar.cc/300?img=15',
                name: 'Phillip Fry',
                availableSlots: {
                    '2017-04-01': ['7:00', '8:00']
                },
            };
            const bookingsByResource = {

            };
            before(() => {
                const store = createNew(
                    { staff: { ...initialState, selectedStaffMember, bookingsByResource } }
                );
                store.dispatch(
                    {
                        type: DATE_SELECTED,
                        date
                    }
                );
                state = store.getState().staff;
            });

            it('adds the selected date and available slots to selectedStaffMember', () => {
                expect(state).to.eql({
                    ...initialState,
                    selectedStaffMember: {
                        ...state.selectedStaffMember,
                        selectedDate: date,
                        slotsForDate: selectedStaffMember.availableSlots[formattedDate]
                    },
                    bookingsByResource
                });
            });

        });
        context('and there are available slots for that date with bookings', () => {
            let state;
            const formattedDate = '2017-04-01';
            const date = moment(formattedDate);
            const resourceId = '1b358118-fef1-11e7-8be5-0ed5f89f718b';
            const startTime = '7:00';
            const endTime = '8:00';
            const selectedStaffMember = {
                id: resourceId, // resourceId
                imagePath: 'http://i.pravatar.cc/300?img=15',
                name: 'Phillip Fry',
                availableSlots: {
                    [formattedDate]: ['7:00', '8:00']
                },
            };
            const bookingsByResource = {
                [resourceId]: {
                    [formattedDate]: [{
                        startTime,
                        endTime
                    }]
                }
            };
            before(() => {
                const store = createNew(
                    { staff: { ...initialState, selectedStaffMember, bookingsByResource } }
                );
                store.dispatch(
                    {
                        type: DATE_SELECTED,
                        date
                    }
                );
                state = store.getState().staff;
            });

            it('picks out time slots that are booked for the resource with selected date', () => {
                expect(state).to.eql({
                    ...initialState,
                    selectedStaffMember: {
                        ...state.selectedStaffMember,
                        selectedDate: date,
                        slotsForDate: selectedStaffMember.availableSlots[formattedDate],
                        bookingsForDate: [{ startTime, endTime }]
                    },
                    bookingsByResource
                });
            });

        });

        context('and there are NO available slots for that date', () => {
            let state;
            const oldDate = moment('1970-10-15');
            const bookingsByResource = {};
            before(() => {
                const selectedStaffMember = {
                    id: '1b358118-fef1-11e7-8be5-0ed5f89f718b', // resourceId
                    imagePath: 'http://i.pravatar.cc/300?img=15',
                    name: 'Phillip Fry',
                    availableSlots: {
                        '2017-04-01': ['7:00', '8:00']
                    }
                };
                const store = createNew(
                    { staff: { ...initialState, selectedStaffMember, bookingsByResource } }
                );
                store.dispatch(
                    {
                        type: DATE_SELECTED,
                        date: oldDate
                    }
                );
                state = store.getState().staff;
            });

            it('has an empty array for slotsForDate', () => {
                expect(state).to.eql({
                    ...initialState,
                    selectedStaffMember: {
                        ...state.selectedStaffMember,
                        selectedDate: oldDate,
                        slotsForDate: []
                    },
                    bookingsByResource
                });
            });

        });

    });

    context(`when ${SLOTS_FETCHED} is dispatched`, () => {
        let state;
        const resourceId = staffMembers[3].id;
        const month = 2;
        const year = 2017;
        const nextMonth = month + 1;
        const nextYear = year + 1;
        const allAvailableSlots = {
            [resourceId]: { // resourceId
                [year]: { // year index
                    [month]: { // month index
                        '2017-03-30': ['6:00 PM', '6:30 PM']
                    }
                }
            },
            [staffMembers[2].id]: {
                [year]: { // year index
                    2: {
                        '2017-03-31': ['12:00 PM', '12:30 PM']
                    }
                }
            }
        };

        const fetchedAvailableSlots = {
            [resourceId]: { // resourceId
                [year]: { // year index
                    [nextMonth]: { // month index
                        '2017-04-30': ['6:00 PM', '6:30 PM']
                    }
                },
                [nextYear]: { // year index
                    [nextMonth]: { // month index
                        '2018-04-30': ['6:00 PM', '6:30 PM']
                    }
                }
            }
        };
        const startDate = moment.utc();
        const dayPickerMonth = startDate.toDate();
        const loading = false;

        context('and there availableSlots do not already exist in the state', () => {
            const availableSlots = allAvailableSlots[resourceId][year][month];
            before(() => {

                const store = createNew({ staff: { ...initialState, staffMembers } });
                store.dispatch(
                    {
                        type: SLOTS_FETCHED,
                        availableSlots,
                        id: resourceId,
                        month,
                        year,
                        fetchedDate: startDate,
                        dayPickerMonth,
                        loading
                    }
                );
                state = store.getState().staff;
            });
            it('sets allavailableSlots and selected staff in the store', () => {
                expect(state).to.eql({
                    ...initialState,
                    staffMembers,
                    allAvailableSlots: { [resourceId]: { [year]: { [month]: availableSlots } } },
                    selectedStaffMember: {
                        ...initialState.selectedStaffMember,
                        availableSlots,
                        dayPickerMonth,
                        selectedDate: startDate
                    },
                    loading
                });
            });
        });

        context('and there availableSlots already exist in the state', () => {
            const availableSlots = fetchedAvailableSlots[resourceId][year][nextMonth];
            before(() => {

                const store = createNew(
                    { staff: { ...initialState, allAvailableSlots, staffMembers } }
                );
                store.dispatch(
                    {
                        type: SLOTS_FETCHED,
                        availableSlots,
                        id: resourceId,
                        month: nextMonth,
                        year,
                        fetchedDate: startDate,
                        dayPickerMonth,
                        loading
                    }
                );
                state = store.getState().staff;
            });
            it('merges allAvailableSlots', () => {
                expect(state).to.eql({
                    ...initialState,
                    staffMembers,
                    selectedStaffMember: {
                        ...initialState.selectedStaffMember,
                        availableSlots,
                        selectedDate: startDate,
                        dayPickerMonth
                    },
                    allAvailableSlots: {
                        ...allAvailableSlots,
                        [resourceId]: {
                            [year]: {
                                ...allAvailableSlots[resourceId][year],
                                ...fetchedAvailableSlots[resourceId][year]
                            }
                        }
                    },
                    loading
                });
            });
        });

        context('and the following year has been fetched', () => {
            const availableSlots = fetchedAvailableSlots[resourceId][nextYear][nextMonth];
            before(() => {

                const store = createNew(
                    { staff: { ...initialState, allAvailableSlots, staffMembers } }
                );
                store.dispatch(
                    {
                        type: SLOTS_FETCHED,
                        availableSlots,
                        id: resourceId,
                        month: nextMonth,
                        year: nextYear,
                        fetchedDate: startDate,
                        dayPickerMonth,
                        loading
                    }
                );
                state = store.getState().staff;
            });
            it('merges allAvailableSlots with the following year', () => {
                expect(state).to.eql({
                    ...initialState,
                    staffMembers,
                    selectedStaffMember: {
                        ...initialState.selectedStaffMember,
                        availableSlots,
                        selectedDate: startDate,
                        dayPickerMonth
                    },
                    allAvailableSlots: {
                        ...allAvailableSlots,
                        [resourceId]: {
                            ...allAvailableSlots[resourceId],
                            [nextYear]: fetchedAvailableSlots[resourceId][nextYear]
                        }
                    },
                    loading
                });
            });
        });

    });

    context(`when ${CLEAR_SELECTED_STAFF_MEMBER} is dispatched`, () => {
        let state;
        const selectedStaffMember = {
            id: '28156f82-fef2-11e7-8be5-0ed5f89f718b', // resourceId
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry',
            availableSlots: {
                '2017-04-01': ['7:00', '8:00']
            }
        };
        before(() => {
            const store = createNew({ staff: { ...initialState, selectedStaffMember } });
            store.dispatch({
                type: CLEAR_SELECTED_STAFF_MEMBER
            });
            state = store.getState().staff;
        });

        it('has the state cleared out of selectedStaff', () => {
            expect(state).to.eql(initialState);
        });
    });

    context(`when ${BOOKINGS_FETCHED} is dispatched`, () => {
        let state;
        const bookingsByResource = {
            '2d0ca6ea-fef2-11e7-8be5-0ed5f89f718b': {
                '2017-06-01': [{
                    startTime: '8:00 PM',
                    endTime: '9:00 PM'
                }]
            },
            '30e9491c-fef2-11e7-8be5-0ed5f89f718b': {
                '2017-06-01': [{
                    startTime: '2:00 AM',
                    endTime: '3:00 AM'
                }]
            }
        };
        before(() => {
            const store = createNew();
            store.dispatch({
                type: BOOKINGS_FETCHED,
                bookingsByResource
            });
            state = store.getState().staff;
        });

        it('has the state cleared out of selectedStaff', () => {
            expect(state).to.eql({
                ...initialState,
                bookingsByResource
            });
        });
    });

    context(`when ${STAFF_SELECTED} is dispatched`, () => {
        let state;
        const resourceId = staffMembers[3].id;
        const staffMember = find(staffMembers, staff => (staff.id === resourceId));
        before(() => {
            const store = createNew({ staff: { ...initialState, staffMembers } });
            store.dispatch({
                type: STAFF_SELECTED,
                id: resourceId
            });
            state = store.getState().staff;
        });

        it('sets the chosen staff member in the store', () => {
            expect(state).to.eql({
                ...initialState,
                staffMembers,
                selectedStaffMember: {
                    ...initialState.selectedStaffMember,
                    ...staffMember
                }
            });
        });
    });

    context(`when ${IS_LOADING} is dispatched with true`, () => {
        let state;
        before(() => {
            const store = createNew();
            store.dispatch({
                type: IS_LOADING,
                loading: true
            });
            state = store.getState().staff;
        });

        it('sets loading to true', () => {
            expect(state).to.eql({
                ...initialState,
                loading: true
            });
        });
    });

    context(`when ${CLEAR_AVAILABLE_SLOTS} is dispatched`, () => {
        let state;
        const firstResourceId = '51f81666-fef1-11e7-8be5-0ed5f89f718b';
        const secondResourceId = '5682b538-fef1-11e7-8be5-0ed5f89f718b';
        const allAvailableSlots = {
            [firstResourceId]: { // resourceId
                2017: { // year index
                    2: { // month index
                        '2017-03-30': ['6:00 PM', '6:30 PM']
                    }
                }
            },
            [secondResourceId]: {
                2017: { // year index
                    2: {
                        '2017-03-31': ['12:00 PM', '12:30 PM']
                    }
                }
            }
        };
        before(() => {
            const store = createNew({ staff: { ...initialState, allAvailableSlots } });
            store.dispatch({
                type: CLEAR_AVAILABLE_SLOTS,
                id: firstResourceId
            });
            state = store.getState().staff;
        });

        it('sets loading to true', () => {
            expect(state).to.eql({
                ...initialState,
                allAvailableSlots: {
                    [secondResourceId]: {
                        2017: { // year index
                            2: {
                                '2017-03-31': ['12:00 PM', '12:30 PM']
                            }
                        }
                    }
                }
            });
        });
    });
});
