import { test, expect } from '@playwright/test';

test('Dcotor go to Facility, the sub page, then go to room bookings for a room and back to main RoomBooking page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByTestId('public-footer-login-link').click();

  await expect(page).toHaveURL('http://localhost:5173/login'); 
  await page.getByTestId('login-username-input').fill('doctor');
  await page.getByTestId('login-password-input').fill('Doctor1234!');
  await page.getByTestId('login-submit-button').click();

  await expect(page).toHaveURL('http://localhost:5173/app/overview'); 

  await page.getByTestId('sidebar-desktop-facilities-link-open-button').click();
  await expect(page).toHaveURL('http://localhost:5173/app/facilities'); 

  // check data
  await expect(page.getByTestId('facilities-table-row-0-cell-id')).toContainText('1');
  await expect(page.getByTestId('facilities-table-row-0-cell-name')).toContainText('main hospital');
  await expect(page.getByTestId('facilities-table-row-0-cell-address')).toContainText('123 health st');
  await expect(page.getByTestId('facilities-table-row-1-cell-id')).toContainText('2');
  await expect(page.getByTestId('facilities-table-row-1-cell-name')).toContainText('specialist wing');
  await expect(page.getByTestId('facilities-table-row-1-cell-address')).toContainText('456 care ave');


  await page.getByTestId('facilities-table-row-0-cell-name').click();
  await expect(page).toHaveURL('http://localhost:5173/app/facilities/1'); 

  // big check
  // TODO - maybe remove
  await expect(page.getByTestId('one-facility-floor-1')).toContainText('ground floorroom a101room a102room a103room a104room a105');
  await expect(page.getByTestId('one-facility-floor-2')).toContainText('first floorroom a201room a202room a203room a204room a205');
  await expect(page.getByTestId('one-facility-floor-3')).toContainText('second floorroom a301room a302room a303room a304room a305');

  // each check
  // ground floor
  await expect(page.getByTestId('one-facility-floor-1')).toContainText('ground floor');
  await expect(page.getByTestId('one-facility-room-1')).toContainText('room a101');
  await expect(page.getByTestId('one-facility-room-2')).toContainText('room a102');
  await expect(page.getByTestId('one-facility-room-3')).toContainText('room a103');
  await expect(page.getByTestId('one-facility-room-4')).toContainText('room a104');
  await expect(page.getByTestId('one-facility-room-5')).toContainText('room a105');

  // floor 1
  await expect(page.getByTestId('one-facility-floor-2')).toContainText('first floor');
  await expect(page.getByTestId('one-facility-room-6')).toContainText('room a201');
  await expect(page.getByTestId('one-facility-room-7')).toContainText('room a202');
  await expect(page.getByTestId('one-facility-room-8')).toContainText('room a203');
  await expect(page.getByTestId('one-facility-room-9')).toContainText('room a204');
  await expect(page.getByTestId('one-facility-room-10')).toContainText('room a205');

  // floor 2
  await expect(page.getByTestId('one-facility-floor-3')).toContainText('second floor');
  await expect(page.getByTestId('one-facility-room-11')).toContainText('room a301');
  await expect(page.getByTestId('one-facility-room-12')).toContainText('room a302');
  await expect(page.getByTestId('one-facility-room-13')).toContainText('room a303');
  await expect(page.getByTestId('one-facility-room-14')).toContainText('room a304');
  await expect(page.getByTestId('one-facility-room-15')).toContainText('room a305');

  await page.getByText('room a101').click();
  await expect(page).toHaveURL('http://localhost:5173/app/room_booking/room/1');


  await expect(page.getByTestId('one-room-heading')).toContainText('room a101');
  await expect(page.getByTestId('one-room-floor')).toContainText('Floor: ground floor');
  await expect(page.getByTestId('one-room-page')).toContainText('Booking History');
  await expect(page.getByTestId('one-room-booking-row-11')).toContainText('11');
  await expect(page.getByTestId('one-room-booking-row-11')).toContainText('michael conklin');
  await expect(page.getByTestId('one-room-booking-row-11')).toContainText('1.1.2099, 08.00.00');
  await expect(page.getByTestId('one-room-booking-row-11')).toContainText('1.1.2099, 09.00.00');
  await expect(page.getByTestId('one-room-booking-row-1')).toContainText('1');
  await expect(page.getByTestId('one-room-booking-row-1')).toContainText('michael conklin');
  await expect(page.getByTestId('one-room-booking-row-1')).toContainText('7.10.2025, 08.00.00');
  await expect(page.getByTestId('one-room-booking-row-1')).toContainText('7.10.2025, 12.00.00');
  
  await page.getByTestId('one-room-back-button').click();
  await expect(page).toHaveURL('http://localhost:5173/app/room_booking'); 

  // bookings - read check
  await expect(page.getByTestId('room-booking-tab-bookings')).toContainText('Bookings');
  await expect(page.getByTestId('room-booking-table-row-0-cell-id')).toContainText('1');
  await expect(page.getByTestId('room-booking-table-row-0-cell-roomName')).toContainText('room a101');
  await expect(page.getByTestId('room-booking-table-row-0-cell-patientName')).toContainText('michael conklin');
  await expect(page.getByTestId('room-booking-table-row-0-cell-startTime')).toContainText('7.10.2025, 08.00.00');
  await expect(page.getByTestId('room-booking-table-row-0-cell-endTime')).toContainText('7.10.2025, 12.00.00');
  await expect(page.getByTestId('room-booking-table-row-1-cell-id')).toContainText('2');
  await expect(page.getByTestId('room-booking-table-row-1-cell-roomName')).toContainText('room a102');
  await expect(page.getByTestId('room-booking-table-row-1-cell-patientName')).toContainText('darlene kelly');
  await expect(page.getByTestId('room-booking-table-row-1-cell-startTime')).toContainText('7.10.2025, 09.00.00');
  await expect(page.getByTestId('room-booking-table-row-1-cell-endTime')).toContainText('7.10.2025, 13.00.00');
  await expect(page.getByTestId('room-booking-table-row-3-cell-id')).toContainText('4');
  await expect(page.getByTestId('room-booking-table-row-3-cell-roomName')).toContainText('room a104');
  await expect(page.getByTestId('room-booking-table-row-3-cell-patientName')).toContainText('jennifer love');
  await expect(page.getByTestId('room-booking-table-row-3-cell-startTime')).toContainText('7.10.2025, 11.00.00');
  await expect(page.getByTestId('room-booking-table-row-3-cell-endTime')).toContainText('7.10.2025, 15.00.00');
  await expect(page.getByTestId('room-booking-table-row-4-cell-id')).toContainText('5');
  await expect(page.getByTestId('room-booking-table-row-4-cell-roomName')).toContainText('room a105');
  await expect(page.getByTestId('room-booking-table-row-4-cell-patientName')).toContainText('eloise lininger');
  await expect(page.getByTestId('room-booking-table-row-4-cell-startTime')).toContainText('7.10.2025, 12.00.00');
  await expect(page.getByTestId('room-booking-table-row-4-cell-endTime')).toContainText('7.10.2025, 16.00.00');
  await expect(page.getByTestId('room-booking-table-row-5-cell-id')).toContainText('6');
  await expect(page.getByTestId('room-booking-table-row-5-cell-roomName')).toContainText('room a201');
  await expect(page.getByTestId('room-booking-table-row-5-cell-patientName')).toContainText('sharon miller');
  await expect(page.getByTestId('room-booking-table-row-5-cell-startTime')).toContainText('7.10.2025, 13.00.00');
  await expect(page.getByTestId('room-booking-table-row-5-cell-endTime')).toContainText('7.10.2025, 17.00.00');
  await expect(page.getByTestId('room-booking-table-row-6-cell-id')).toContainText('7');
  await expect(page.getByTestId('room-booking-table-row-6-cell-roomName')).toContainText('room a202');
  await expect(page.getByTestId('room-booking-table-row-6-cell-patientName')).toContainText('phillip rape');
  await expect(page.getByTestId('room-booking-table-row-6-cell-startTime')).toContainText('7.10.2025, 14.00.00');
  await expect(page.getByTestId('room-booking-table-row-6-cell-endTime')).toContainText('7.10.2025, 18.00.00');
  await expect(page.getByTestId('room-booking-table-row-7-cell-id')).toContainText('8');
  await expect(page.getByTestId('room-booking-table-row-7-cell-roomName')).toContainText('room a203');
  await expect(page.getByTestId('room-booking-table-row-7-cell-patientName')).toContainText('frances johnson');
  await expect(page.getByTestId('room-booking-table-row-7-cell-startTime')).toContainText('7.10.2025, 15.00.00');
  await expect(page.getByTestId('room-booking-table-row-7-cell-endTime')).toContainText('7.10.2025, 19.00.00');
  await expect(page.getByTestId('room-booking-table-row-8-cell-id')).toContainText('9');
  await expect(page.getByTestId('room-booking-table-row-8-cell-roomName')).toContainText('room a204');
  await expect(page.getByTestId('room-booking-table-row-8-cell-patientName')).toContainText('rickey martin');
  await expect(page.getByTestId('room-booking-table-row-8-cell-startTime')).toContainText('7.10.2025, 16.00.00');
  await expect(page.getByTestId('room-booking-table-row-8-cell-endTime')).toContainText('7.10.2025, 20.00.00');
  await expect(page.getByTestId('room-booking-table-row-9-cell-id')).toContainText('10');
  await expect(page.getByTestId('room-booking-table-row-9-cell-roomName')).toContainText('room a205');
  await expect(page.getByTestId('room-booking-table-row-9-cell-patientName')).toContainText('mayra james');
  await expect(page.getByTestId('room-booking-table-row-9-cell-startTime')).toContainText('7.10.2025, 17.00.00');
  await expect(page.getByTestId('room-booking-table-row-9-cell-endTime')).toContainText('7.10.2025, 21.00.00');

  await page.getByTestId('room-booking-tab-rooms').click();

  await expect(page.getByTestId('room-booking-rooms-table').locator('thead')).toContainText('Id');
  await expect(page.getByTestId('room-booking-rooms-table').locator('thead')).toContainText('Room');
  await expect(page.getByTestId('room-booking-rooms-table').locator('thead')).toContainText('Floor');
  await expect(page.getByTestId('room-booking-rooms-row-1')).toContainText('1');
  await expect(page.getByTestId('room-booking-rooms-row-1')).toContainText('room a101');
  await expect(page.getByTestId('room-booking-rooms-row-1')).toContainText('ground floor');
  await expect(page.getByTestId('room-booking-rooms-row-6')).toContainText('6');
  await expect(page.getByTestId('room-booking-rooms-row-6')).toContainText('room a201');
  await expect(page.getByTestId('room-booking-rooms-row-6')).toContainText('first floor');
  await expect(page.getByTestId('room-booking-rooms-row-11')).toContainText('11');
  await expect(page.getByTestId('room-booking-rooms-row-11')).toContainText('room a301');
  await expect(page.getByTestId('room-booking-rooms-row-11')).toContainText('second floor');
  await expect(page.getByTestId('room-booking-rooms-row-16')).toContainText('16');
  await expect(page.getByTestId('room-booking-rooms-row-16')).toContainText('room b101');
  await expect(page.getByTestId('room-booking-rooms-row-16')).toContainText('ground floor');
  await expect(page.getByTestId('room-booking-rooms-row-21')).toContainText('21');
  await expect(page.getByTestId('room-booking-rooms-row-21')).toContainText('room b201');
  await expect(page.getByTestId('room-booking-rooms-row-21')).toContainText('first floor');
  await expect(page.getByTestId('room-booking-rooms-row-26')).toContainText('26');
  await expect(page.getByTestId('room-booking-rooms-row-26')).toContainText('room b301');
  await expect(page.getByTestId('room-booking-rooms-row-26')).toContainText('second floor');
  
  
  await page.getByTestId('dashboard-navbar-logout-button').click();await page.getByTestId('dashboard-navbar-logout-button').click();
  await expect(page).toHaveURL('http://localhost:5173/login'); 
});