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
  // each cell in order: id, name, address
  await expect(page.getByTestId('facilities-table-row-0').locator('td')).toHaveText(['1', 'main hospital', '123 health st']);
  await expect(page.getByTestId('facilities-table-row-1').locator('td')).toHaveText(['2', 'specialist wing', '456 care ave']);


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
  await expect(page.getByTestId('one-room-booking-row-11').locator('td')).toHaveText(['11', 'michael conklin', '01/01/2099, 08:00:00', '01/01/2099, 09:00:00']);
  await expect(page.getByTestId('one-room-booking-row-1').locator('td')).toHaveText(['1', 'michael conklin', '07/10/2025, 08:00:00', '07/10/2025, 12:00:00']);
  
  await page.getByTestId('one-room-back-button').click();
  await expect(page).toHaveURL('http://localhost:5173/app/room_booking'); 

  // bookings - read check
  await expect(page.getByTestId('room-booking-tab-bookings')).toContainText('Bookings');
  await expect(page.getByTestId('room-booking-table-row-0').locator('td')).toHaveText(['1', 'room a101', 'michael conklin', '07/10/2025, 08:00:00', '07/10/2025, 12:00:00', '']);
  await expect(page.getByTestId('room-booking-table-row-1').locator('td')).toHaveText(['2', 'room a102', 'darlene kelly', '07/10/2025, 09:00:00', '07/10/2025, 13:00:00', '']);
  await expect(page.getByTestId('room-booking-table-row-3').locator('td')).toHaveText(['4', 'room a104', 'jennifer love', '07/10/2025, 11:00:00', '07/10/2025, 15:00:00', '']);
  await expect(page.getByTestId('room-booking-table-row-4').locator('td')).toHaveText(['5', 'room a105', 'eloise lininger', '07/10/2025, 12:00:00', '07/10/2025, 16:00:00', '']);
  await expect(page.getByTestId('room-booking-table-row-5').locator('td')).toHaveText(['6', 'room a201', 'sharon miller', '07/10/2025, 13:00:00', '07/10/2025, 17:00:00', '']);
  await expect(page.getByTestId('room-booking-table-row-6').locator('td')).toHaveText(['7', 'room a202', 'phillip rape', '07/10/2025, 14:00:00', '07/10/2025, 18:00:00', '']);
  await expect(page.getByTestId('room-booking-table-row-7').locator('td')).toHaveText(['8', 'room a203', 'frances johnson', '07/10/2025, 15:00:00', '07/10/2025, 19:00:00', '']);
  await expect(page.getByTestId('room-booking-table-row-8').locator('td')).toHaveText(['9', 'room a204', 'rickey martin', '07/10/2025, 16:00:00', '07/10/2025, 20:00:00', '']);
  await expect(page.getByTestId('room-booking-table-row-9').locator('td')).toHaveText(['10', 'room a205', 'mayra james', '07/10/2025, 17:00:00', '07/10/2025, 21:00:00', '']);

  await page.getByTestId('room-booking-tab-rooms').click();

  await expect(page.getByTestId('room-booking-rooms-table').locator('thead th')).toHaveText(['Id', 'Room', 'Floor']);
  await expect(page.getByTestId('room-booking-rooms-row-1').locator('td')).toHaveText(['1', 'room a101', 'ground floor']);
  await expect(page.getByTestId('room-booking-rooms-row-6').locator('td')).toHaveText(['6', 'room a201', 'first floor']);
  await expect(page.getByTestId('room-booking-rooms-row-11').locator('td')).toHaveText(['11', 'room a301', 'second floor']);
  await expect(page.getByTestId('room-booking-rooms-row-16').locator('td')).toHaveText(['16', 'room b101', 'ground floor']);
  await expect(page.getByTestId('room-booking-rooms-row-21').locator('td')).toHaveText(['21', 'room b201', 'first floor']);
  await expect(page.getByTestId('room-booking-rooms-row-26').locator('td')).toHaveText(['26', 'room b301', 'second floor']);
  
  
  await page.getByTestId('dashboard-navbar-logout-button').click();
  await expect(page).toHaveURL('http://localhost:5173/login'); 
});