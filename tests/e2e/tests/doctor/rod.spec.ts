import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByTestId('home-book-appointment-button').click();
  await page.getByTestId('home-explore-services-button').click();
  await page.getByTestId('public-footer-home-link').click();
  await page.getByTestId('public-footer-about-link').click();
  await page.getByTestId('public-footer-doctors-link').click();
  await page.getByTestId('public-footer-contact-link').click();
  await page.getByTestId('nav-contact-link').click();
  await page.getByTestId('nav-home-link').click();
  await page.getByTestId('nav-about-link').click();
  await page.getByTestId('nav-doctors-link').click();
  await page.getByTestId('nav-book-link').click();
  await page.getByTestId('appointment-name-input').click();
  await page.getByTestId('appointment-phone-input').click();
  await page.getByTestId('appointment-email-input').click();
  await page.getByTestId('appointment-department-select').selectOption('Pediatrics');
  await page.getByTestId('appointment-date-input').fill('2026-08-04');
  await page.getByTestId('appointment-time-input').click();
  await page.getByTestId('appointment-time-input').click();
  await page.getByTestId('appointment-time-input').click();
  await page.getByTestId('appointment-time-input').fill('20:30');
  await page.getByTestId('appointment-reason-input').click();
  await page.getByTestId('appointment-reason-input').fill('text');
  await page.getByTestId('appointment-submit-button').click();
  await page.goto('http://localhost:5173/login');
  await page.getByTestId('login-username-input').click();
  await page.getByTestId('login-username-input').fill('doctor');
  await page.getByTestId('login-username-input').press('Tab');
  await page.getByTestId('login-password-input').fill('e');
  await page.getByTestId('login-submit-button').click();
  await page.getByTestId('login-feedback-text').click();
  await page.getByTestId('login-dashboard-link').click();
  await page.getByTestId('login-username-input').click();
  await page.getByTestId('login-username-input').fill('doctor');
  await page.getByTestId('login-username-input').press('Tab');
  await page.getByTestId('login-password-input').fill('Doctor1234!');
  await page.getByTestId('login-submit-button').click();
  await page.getByTestId('overview-card-0-title').click();
  await page.getByTestId('overview-card-0-value').click();
  await page.getByTestId('overview-card-1-title').click();
  await page.getByTestId('overview-card-1-value').click();
  await page.getByTestId('overview-card-2-title').click();
  await page.getByText('rooms in useB1').click();
  await page.getByTestId('overview-card-2-value').click();
  await page.getByTestId('overview-card-3-title').click();
  await page.getByTestId('overview-card-3-value').click();
  await page.getByTestId('overview-card-4-title').click();
  await page.getByTestId('overview-card-4-type').click();
  await page.getByTestId('overview-card-4-value').click();
  await page.getByText('departmentsopen').click();
  await page.getByText('department staffopen').click();
  await page.getByText('facilitiesopen').click();
  await page.getByText('missing medsopen').click();
  await page.getByText('medicin storageopen').click();
  await page.getByText('find medicin priceopen').click();
  await page.getByText('patientsopen').click();
  await page.getByText('shiftsopen').click();
  await page.getByText('room bookingopen').click();
  await page.getByText('treatmentopen').click();
  await page.getByTestId('dashboard-navbar').click();
  await page.getByTestId('dashboard-navbar-user-greeting').click();
  await page.getByTestId('dashboard-navbar-user-greeting').click();
  await expect(page.getByTestId('dashboard-navbar-user-greeting')).toContainText('Hello eva møller');
  await expect(page.getByTestId('overview-card-0-value')).toContainText('253');
  await page.getByTestId('overview-card-2-value').click();
  await expect(page.getByTestId('overview-card-2-value')).toContainText('22');
  await expect(page.getByTestId('overview-card-1-value')).toContainText('25');
  await expect(page.getByTestId('overview-card-3-value')).toContainText('34');
  await expect(page.getByTestId('overview-card-4-value')).toContainText('22');
  await expect(page.getByText('departmentsopen')).toBeVisible();
  await page.getByText('department staffopen').click();
  await page.getByText('facilitiesopen').click();
  await expect(page.getByText('department staffopen')).toBeVisible();
  await expect(page.getByText('facilitiesopen')).toBeVisible();
  await expect(page.getByText('department staffopen')).toBeVisible();
  await expect(page.getByText('missing medsopen')).toBeVisible();
  await expect(page.getByText('medicin storageopen')).toBeVisible();
  await expect(page.getByText('medicin storageopen')).toBeVisible();
  await expect(page.getByText('find medicin priceopen')).toBeVisible();
  await expect(page.getByText('patientsopen')).toBeVisible();
  await expect(page.getByText('patientsopen')).toBeVisible();
  await expect(page.getByText('shiftsopen')).toBeVisible();
  await expect(page.getByText('room bookingopen')).toBeVisible();
  await expect(page.getByText('treatmentopen')).toBeVisible();
  await page.getByTestId('sidebar-desktop-departments-link-open-button').click();
  await page.getByText('Departments Add Department').click();
  await expect(page.getByTestId('departments-table-row-0-cell-name')).toBeVisible();
  await expect(page.getByTestId('departments-table-row-0-cell-name')).toContainText('cardiology');
  await expect(page.getByTestId('departments-table-row-1-cell-name')).toContainText('pediatrics');
  await expect(page.getByTestId('departments-table-row-3-cell-name')).toBeVisible();
  await expect(page.getByTestId('departments-table-row-4-cell-name')).toContainText('surgery1');
  await expect(page.getByTestId('departments-table-row-3-cell-name')).toContainText('Emergency');
  await expect(page.getByTestId('departments-table-row-2-cell-name')).toContainText('radiology');
  await expect(page.getByTestId('departments-table-row-1-cell-name')).toContainText('pediatrics');
  await expect(page.getByTestId('departments-table-row-0-cell-name')).toContainText('cardiology');
  await expect(page.getByTestId('departments-table-row-0-cell-type')).toContainText('specialist');
  await expect(page.getByTestId('departments-table-row-1-cell-type')).toContainText('child care');
  await expect(page.getByTestId('departments-table-row-2-cell-type')).toContainText('diagnostics');
  await expect(page.getByTestId('departments-table-row-3-cell-type')).toContainText('Critical Care');
  await expect(page.getByTestId('departments-table-row-4-cell-type')).toContainText('operation');
  await expect(page.getByTestId('departments-table-row-0-cell-id')).toContainText('3');
  await expect(page.getByTestId('departments-table-row-1-cell-id')).toContainText('4');
  await expect(page.getByTestId('departments-table-row-2-cell-id')).toContainText('5');
  await expect(page.getByTestId('departments-table-row-3-cell-id')).toContainText('1');
  await expect(page.getByTestId('departments-table-row-4-cell-id')).toContainText('2');
  await expect(page.getByTestId('departments-table-sort-type').getByRole('button', { name: 'Sort' })).toBeVisible();
  await expect(page.getByTestId('departments-table-sort-name').getByRole('button', { name: 'Sort' })).toBeVisible();
  await expect(page.getByTestId('departments-table-sort-id').getByRole('button', { name: 'Sort' })).toBeVisible();
  await page.getByTestId('departments-table-sort-id').getByRole('button', { name: 'Sort' }).click();
  await expect(page.getByTestId('departments-table-row-0-cell-id')).toBeVisible();
  await expect(page.getByTestId('departments-table-row-0-cell-id')).toContainText('1');
  await expect(page.getByTestId('departments-table-row-1-cell-id')).toContainText('2');
  await expect(page.getByTestId('departments-table-row-2-cell-id')).toContainText('3');
  await expect(page.getByTestId('departments-table-row-3-cell-id')).toBeVisible();
  await expect(page.getByTestId('departments-table-row-4-cell-id')).toContainText('5');
  await expect(page.getByTestId('departments-add-button')).toBeVisible();
  await expect(page.getByTestId('departments-edit-1')).toBeVisible();
  await expect(page.getByTestId('departments-edit-2')).toBeVisible();
  await expect(page.getByTestId('departments-edit-3')).toBeVisible();
  await expect(page.getByTestId('departments-edit-4')).toBeVisible();
  await expect(page.getByTestId('departments-edit-5')).toBeVisible();
  await expect(page.getByTestId('departments-delete-1')).toBeVisible();
  await expect(page.getByTestId('departments-delete-5')).toBeVisible();
  await page.getByTestId('sidebar-desktop-department-staff-link-open-button').click();
  await expect(page.getByTestId('department-staff-page-heading')).toBeVisible();
  await expect(page.getByTestId('department-staff-table-row-0-cell-department')).toBeVisible();
  await page.getByTestId('department-staff-table-row-0-cell-department').click();
  await expect(page.getByTestId('department-staff-table-row-0-cell-staff')).toContainText('Lars christensen');
  await expect(page.getByTestId('department-staff-table-row-1-cell-staff')).toContainText('eva møller');
  await expect(page.getByTestId('department-staff-table-row-3-cell-staff')).toContainText('maria jensen');
  await expect(page.getByTestId('department-staff-table-row-2-cell-staff')).toContainText('thomas pedersen');
  await expect(page.getByTestId('department-staff-table-row-4-cell-staff')).toContainText('peter poulsen');
  await expect(page.getByTestId('department-staff-table-row-3-cell-staff')).toContainText('maria jensen');
  await expect(page.getByTestId('department-staff-table-row-6-cell-staff')).toContainText('mikkel hansen');
  await expect(page.getByTestId('department-staff-table-row-7-cell-staff')).toContainText('laura larsen');
  await expect(page.getByTestId('department-staff-table-row-8-cell-staff')).toContainText('frederik olsen');
  await expect(page.getByTestId('department-staff-table-row-9-cell-staff')).toContainText('clara andersen');
  await page.getByTestId('department-staff-table-pagination-page-2').click();
  await expect(page.getByTestId('department-staff-table-row-0-cell-staff')).toContainText('simon christensen');
  await expect(page.getByTestId('department-staff-table-row-1-cell-staff')).toContainText('sofie møller');
  await expect(page.getByTestId('department-staff-table-row-2-cell-staff')).toContainText('anders pedersen');
  await expect(page.getByTestId('department-staff-table-row-3-cell-staff')).toContainText('ida jensen');
  await expect(page.getByTestId('department-staff-table-row-4-cell-staff')).toContainText('rasmus poulsen');
  await expect(page.getByTestId('department-staff-table-row-5-cell-staff')).toContainText('mia nielsen');
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - paragraph: Department Staff
    - table:
      - rowgroup:
        - row "Id Sort Department Sort Staff Sort":
          - columnheader "Id Sort":
            - paragraph: Id
            - button "Sort":
              - img
          - columnheader "Department Sort":
            - paragraph: Department
            - button "Sort":
              - img
          - columnheader "Staff Sort":
            - paragraph: Staff
            - button "Sort":
              - img
      - rowgroup:
        - row /\\d+ Emergency \\(Critical Care\\) simon christensen/:
          - cell /\\d+/
          - cell "Emergency (Critical Care)"
          - cell "simon christensen"
        - row /\\d+ surgery1 \\(operation\\) sofie møller/:
          - cell /\\d+/
          - cell "surgery1 (operation)"
          - cell "sofie møller"
        - row /\\d+ cardiology \\(specialist\\) anders pedersen/:
          - cell /\\d+/
          - cell "cardiology (specialist)"
          - cell "anders pedersen"
        - row /\\d+ pediatrics \\(child care\\) ida jensen/:
          - cell /\\d+/
          - cell "pediatrics (child care)"
          - cell "ida jensen"
        - row /\\d+ radiology \\(diagnostics\\) rasmus poulsen/:
          - cell /\\d+/
          - cell "radiology (diagnostics)"
          - cell "rasmus poulsen"
        - row /\\d+ Emergency \\(Critical Care\\) mia nielsen/:
          - cell /\\d+/
          - cell "Emergency (Critical Care)"
          - cell "mia nielsen"
        - row /\\d+ surgery1 \\(operation\\) christian hansen/:
          - cell /\\d+/
          - cell "surgery1 (operation)"
          - cell "christian hansen"
        - row /\\d+ cardiology \\(specialist\\) lise larsen/:
          - cell /\\d+/
          - cell "cardiology (specialist)"
          - cell "lise larsen"
        - row /\\d+ pediatrics \\(child care\\) jacob olsen/:
          - cell /\\d+/
          - cell "pediatrics (child care)"
          - cell "jacob olsen"
        - row /\\d+ radiology \\(diagnostics\\) julie andersen/:
          - cell /\\d+/
          - cell "radiology (diagnostics)"
          - cell "julie andersen"
    - paragraph: Rows per page
    - combobox:
      - option "5"
      - option /\\d+/ [selected]
      - option /\\d+/
      - option /\\d+/
    - img
    - navigation "pagination":
      - button "Previous page":
        - img
      - button "Page 1"
      - button "Page 2"
      - button "Page 3"
      - button "Page 4"
      - button "Page 5"
      - button "Next page":
        - img
    `);
  await page.getByTestId('department-staff-table-pagination-page-1').click();
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - paragraph: Department Staff
    - table:
      - rowgroup:
        - row "Id Sort Department Sort Staff Sort":
          - columnheader "Id Sort":
            - paragraph: Id
            - button "Sort":
              - img
          - columnheader "Department Sort":
            - paragraph: Department
            - button "Sort":
              - img
          - columnheader "Staff Sort":
            - paragraph: Staff
            - button "Sort":
              - img
      - rowgroup:
        - row "1 Emergency (Critical Care) Lars christensen":
          - cell "1"
          - cell "Emergency (Critical Care)"
          - cell "Lars christensen"
        - row "2 Emergency (Critical Care) eva møller":
          - cell "2"
          - cell "Emergency (Critical Care)"
          - cell "eva møller"
        - row "3 surgery1 (operation) thomas pedersen":
          - cell "3"
          - cell "surgery1 (operation)"
          - cell "thomas pedersen"
        - row "4 surgery1 (operation) maria jensen":
          - cell "4"
          - cell "surgery1 (operation)"
          - cell "maria jensen"
        - row "5 cardiology (specialist) peter poulsen":
          - cell "5"
          - cell "cardiology (specialist)"
          - cell "peter poulsen"
        - row "6 cardiology (specialist) anna nielsen":
          - cell "6"
          - cell "cardiology (specialist)"
          - cell "anna nielsen"
        - row "7 pediatrics (child care) mikkel hansen":
          - cell "7"
          - cell "pediatrics (child care)"
          - cell "mikkel hansen"
        - row "8 pediatrics (child care) laura larsen":
          - cell "8"
          - cell "pediatrics (child care)"
          - cell "laura larsen"
        - row "9 radiology (diagnostics) frederik olsen":
          - cell "9"
          - cell "radiology (diagnostics)"
          - cell "frederik olsen"
        - row /\\d+ radiology \\(diagnostics\\) clara andersen/:
          - cell /\\d+/
          - cell "radiology (diagnostics)"
          - cell "clara andersen"
    - paragraph: Rows per page
    - combobox:
      - option "5"
      - option /\\d+/ [selected]
      - option /\\d+/
      - option /\\d+/
    - img
    - navigation "pagination":
      - button "Previous page" [disabled]:
        - img
      - button "Page 1"
      - button "Page 2"
      - button "Page 3"
      - button "Page 4"
      - button "Page 5"
      - button "Next page":
        - img
    `);
  await page.getByTestId('sidebar-desktop-departments-link-open-button').click();
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - paragraph: Departments
    - button "Add Department":
      - img
      - text: ""
    - table:
      - rowgroup:
        - row "Id Sort Name Sort Type Sort Actions":
          - columnheader "Id Sort":
            - paragraph: Id
            - button "Sort":
              - img
          - columnheader "Name Sort":
            - paragraph: Name
            - button "Sort":
              - img
            - textbox "Search Name..."
          - columnheader "Type Sort":
            - paragraph: Type
            - button "Sort":
              - img
            - textbox "Search Type..."
          - columnheader "Actions":
            - paragraph: Actions
      - rowgroup:
        - row "3 cardiology specialist Edit department Delete department":
          - cell "3"
          - cell "cardiology"
          - cell "specialist"
          - cell "Edit department Delete department":
            - button "Edit department":
              - img
            - button "Delete department":
              - img
        - row "4 pediatrics child care Edit department Delete department":
          - cell "4"
          - cell "pediatrics"
          - cell "child care"
          - cell "Edit department Delete department":
            - button "Edit department":
              - img
            - button "Delete department":
              - img
        - row "5 radiology diagnostics Edit department Delete department":
          - cell "5"
          - cell "radiology"
          - cell "diagnostics"
          - cell "Edit department Delete department":
            - button "Edit department":
              - img
            - button "Delete department":
              - img
        - row "1 Emergency Critical Care Edit department Delete department":
          - cell "1"
          - cell "Emergency"
          - cell "Critical Care"
          - cell "Edit department Delete department":
            - button "Edit department":
              - img
            - button "Delete department":
              - img
        - row "2 surgery1 operation Edit department Delete department":
          - cell "2"
          - cell "surgery1"
          - cell "operation"
          - cell "Edit department Delete department":
            - button "Edit department":
              - img
            - button "Delete department":
              - img
    - paragraph: Rows per page
    - combobox:
      - option "5"
      - option /\\d+/ [selected]
      - option /\\d+/
      - option /\\d+/
    - img
    `);
  await page.getByTestId('departments-table-page-size-select').selectOption('5');
  await page.getByTestId('dashboard-main-content').click();
  await page.getByTestId('sidebar-desktop-facilities-link-open-button').click();
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - paragraph: Facilities
    - table:
      - rowgroup:
        - row "Id Sort Name Sort Address Sort":
          - columnheader "Id Sort":
            - paragraph: Id
            - button "Sort":
              - img
          - columnheader "Name Sort":
            - paragraph: Name
            - button "Sort":
              - img
            - textbox "Search Name..."
          - columnheader "Address Sort":
            - paragraph: Address
            - button "Sort":
              - img
            - textbox "Search Address..."
      - rowgroup:
        - row /1 main hospital \\d+ health st/:
          - cell "1"
          - cell "main hospital"
          - cell /\\d+ health st/
        - row /2 specialist wing \\d+ care ave/:
          - cell "2"
          - cell "specialist wing"
          - cell /\\d+ care ave/
    - paragraph: Rows per page
    - combobox:
      - option "5"
      - option /\\d+/ [selected]
      - option /\\d+/
      - option /\\d+/
    - img
    `);
  await expect(page.getByTestId('facilities-table-row-0-cell-name')).toBeVisible();
  await page.getByTestId('facilities-table-row-1-cell-name').click();
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - button "Back to facilities"
    - heading "specialist wing" [level=2]
    - paragraph: "/Address: \\\\d+ care ave/"
    - heading "ground floor" [level=2]
    - img
    - text: room b101
    - img
    - text: room b102
    - img
    - text: room b103
    - img
    - text: room b104
    - img
    - text: room b105
    - heading "first floor" [level=2]
    - img
    - text: room b201
    - img
    - text: room b202
    - img
    - text: room b203
    - img
    - text: room b204
    - img
    - text: room b205
    - heading "second floor" [level=2]
    - img
    - text: room b301
    - img
    - text: room b302
    - img
    - text: room b303
    - img
    - text: room b304
    - img
    - text: room b305
    `);
  await expect(page.getByTestId('one-facility-heading')).toBeVisible();
  await expect(page.getByTestId('one-facility-address')).toBeVisible();
  await expect(page.getByTestId('one-facility-room-16')).toContainText('room b101');
  await expect(page.getByTestId('one-facility-room-16')).toBeVisible();
  await page.getByText('room b101').click();
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - button "Back to room bookings"
    - heading "room b101" [level=2]
    - paragraph: "Floor: ground floor"
    - heading "Booking History" [level=2]
    - table:
      - rowgroup:
        - row "Id Patient Start Time End Time":
          - columnheader "Id"
          - columnheader "Patient"
          - columnheader "Start Time"
          - columnheader "End Time"
      - rowgroup:
        - row "No bookings for this room yet.":
          - cell "No bookings for this room yet."
    `);
  await expect(page.getByTestId('one-room-back-button')).toBeVisible();
  await expect(page.getByTestId('one-room-bookings-empty')).toContainText('No bookings for this room yet.');
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - button "Back to room bookings"
    - heading "room b101" [level=2]
    - paragraph: "Floor: ground floor"
    - heading "Booking History" [level=2]
    - table:
      - rowgroup:
        - row "Id Patient Start Time End Time":
          - columnheader "Id"
          - columnheader "Patient"
          - columnheader "Start Time"
          - columnheader "End Time"
      - rowgroup:
        - row "No bookings for this room yet.":
          - cell "No bookings for this room yet."
    `);
  await page.getByTestId('one-room-back-button').click();
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - paragraph: Room Bookings
    - tablist:
      - tab "Bookings" [selected]
      - tab "Rooms"
    - tabpanel "Bookings":
      - group:
        - text: From
        - textbox "From"
      - group:
        - text: To
        - textbox "To"
      - button "Add Room Booking":
        - img
        - text: ""
      - table:
        - rowgroup:
          - row "Id Sort Room Sort Patient Sort Start Time Sort End Time Sort Actions":
            - columnheader "Id Sort":
              - paragraph: Id
              - button "Sort":
                - img
            - columnheader "Room Sort":
              - paragraph: Room
              - button "Sort":
                - img
              - textbox "Search Room..."
            - columnheader "Patient Sort":
              - paragraph: Patient
              - button "Sort":
                - img
              - textbox "Search Patient..."
            - columnheader "Start Time Sort":
              - paragraph: Start Time
              - button "Sort":
                - img
            - columnheader "End Time Sort":
              - paragraph: End Time
              - button "Sort":
                - img
            - columnheader "Actions":
              - paragraph: Actions
        - rowgroup:
          - row /2 room a102 darlene kelly \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "2"
            - cell "room a102"
            - cell "darlene kelly"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
          - row /3 room a103 edward reep \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "3"
            - cell "room a103"
            - cell "edward reep"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
          - row /4 room a104 jennifer love \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "4"
            - cell "room a104"
            - cell "jennifer love"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
          - row /5 room a105 eloise lininger \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "5"
            - cell "room a105"
            - cell "eloise lininger"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
          - row /6 room a201 sharon miller \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "6"
            - cell "room a201"
            - cell "sharon miller"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
          - row /7 room a202 phillip rape \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "7"
            - cell "room a202"
            - cell "phillip rape"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
          - row /8 room a203 frances johnson \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "8"
            - cell "room a203"
            - cell "frances johnson"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
          - row /9 room a204 rickey martin \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "9"
            - cell "room a204"
            - cell "rickey martin"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
          - row /\\d+ room a205 mayra james \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell /\\d+/
            - cell "room a205"
            - cell "mayra james"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
          - row /1 room a101 michael conklin \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "1"
            - cell "room a101"
            - cell "michael conklin"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
      - paragraph: Rows per page
      - combobox:
        - option "5"
        - option /\\d+/ [selected]
        - option /\\d+/
        - option /\\d+/
      - img
    `);
  await page.getByTestId('room-booking-table-page-size-select').selectOption('5');
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - paragraph: Room Bookings
    - tablist:
      - tab "Bookings" [selected]
      - tab "Rooms"
    - tabpanel "Bookings":
      - group:
        - text: From
        - textbox "From"
      - group:
        - text: To
        - textbox "To"
      - button "Add Room Booking":
        - img
        - text: ""
      - table:
        - rowgroup:
          - row "Id Sort Room Sort Patient Sort Start Time Sort End Time Sort Actions":
            - columnheader "Id Sort":
              - paragraph: Id
              - button "Sort":
                - img
            - columnheader "Room Sort":
              - paragraph: Room
              - button "Sort":
                - img
              - textbox "Search Room..."
            - columnheader "Patient Sort":
              - paragraph: Patient
              - button "Sort":
                - img
              - textbox "Search Patient..."
            - columnheader "Start Time Sort":
              - paragraph: Start Time
              - button "Sort":
                - img
            - columnheader "End Time Sort":
              - paragraph: End Time
              - button "Sort":
                - img
            - columnheader "Actions":
              - paragraph: Actions
        - rowgroup:
          - row /2 room a102 darlene kelly \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "2"
            - cell "room a102"
            - cell "darlene kelly"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
          - row /3 room a103 edward reep \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "3"
            - cell "room a103"
            - cell "edward reep"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
          - row /4 room a104 jennifer love \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "4"
            - cell "room a104"
            - cell "jennifer love"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
          - row /5 room a105 eloise lininger \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "5"
            - cell "room a105"
            - cell "eloise lininger"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
          - row /6 room a201 sharon miller \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit room booking Delete room booking/:
            - cell "6"
            - cell "room a201"
            - cell "sharon miller"
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
            - cell "Edit room booking Delete room booking":
              - button "Edit room booking":
                - img
              - button "Delete room booking":
                - img
      - paragraph: Rows per page
      - combobox:
        - option "5" [selected]
        - option /\\d+/
        - option /\\d+/
        - option /\\d+/
      - img
      - navigation "pagination":
        - button "Previous page" [disabled]:
          - img
        - button "Page 1"
        - button "Page 2"
        - button "Next page":
          - img
    `);
  await page.getByTestId('sidebar-desktop-missing-medicin-link-open-button').click();
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - paragraph: this is Missing Medicin page
    - separator
    - table:
      - rowgroup:
        - row "amount Missing Sort fk Medication Storage Id Sort id Sort went Missing At Sort":
          - columnheader "amount Missing Sort":
            - paragraph: amount Missing
            - button "Sort":
              - img
            - textbox "Search amount Missing..."
          - columnheader "fk Medication Storage Id Sort":
            - paragraph: fk Medication Storage Id
            - button "Sort":
              - img
            - textbox "Search fk Medication Storage Id..."
          - columnheader "id Sort":
            - paragraph: id
            - button "Sort":
              - img
            - textbox "Search id..."
          - columnheader "went Missing At Sort":
            - paragraph: went Missing At
            - button "Sort":
              - img
            - textbox "Search went Missing At..."
      - rowgroup:
        - row /5 2 2 \\d+-\\d+-07T15:\\d+:\\d+/:
          - cell "5":
            - paragraph: "5"
          - cell "2"
          - cell "2":
            - paragraph: "2"
          - cell /\\d+-\\d+-07T15:\\d+:\\d+/:
            - code: /\\d+-\\d+-07T15:\\d+:\\d+/
        - row /\\d+ 1 1 \\d+-\\d+-07T12:\\d+:\\d+/:
          - cell /\\d+/:
            - paragraph: /\\d+/
          - cell "1"
          - cell "1":
            - paragraph: "1"
          - cell /\\d+-\\d+-07T12:\\d+:\\d+/:
            - code: /\\d+-\\d+-07T12:\\d+:\\d+/
        - row /5 1 6 \\d+-\\d+-01T12:\\d+:\\d+/:
          - cell "5":
            - paragraph: "5"
          - cell "1"
          - cell "6":
            - paragraph: "6"
          - cell /\\d+-\\d+-01T12:\\d+:\\d+/:
            - code: /\\d+-\\d+-01T12:\\d+:\\d+/
        - row /5 1 7 \\d+-\\d+-01T12:\\d+:\\d+/:
          - cell "5":
            - paragraph: "5"
          - cell "1"
          - cell "7":
            - paragraph: "7"
          - cell /\\d+-\\d+-01T12:\\d+:\\d+/:
            - code: /\\d+-\\d+-01T12:\\d+:\\d+/
        - row /5 1 8 \\d+-\\d+-01T12:\\d+:\\d+/:
          - cell "5":
            - paragraph: "5"
          - cell "1"
          - cell "8":
            - paragraph: "8"
          - cell /\\d+-\\d+-01T12:\\d+:\\d+/:
            - code: /\\d+-\\d+-01T12:\\d+:\\d+/
    - paragraph: Rows per page
    - combobox:
      - option "5" [selected]
      - option /\\d+/
      - option /\\d+/
      - option /\\d+/
    - img
    - navigation "pagination":
      - button "Previous page" [disabled]:
        - img
      - button "Page 1"
      - button "Page 2"
      - button "Next page":
        - img
    - paragraph: set page count
    - textbox: "5"
    `);
  await expect(page.getByTestId('missing-medicine-page-heading')).toContainText('this is Missing Medicin page');
  await page.getByTestId('sidebar-desktop-external-medicin-link-open-button').click();
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - paragraph: Find Medicin Price
    - button "By Name"
    - button "By Ingredient"
    - textbox "Search by medicin name..."
    - button "Search":
      - img
      - text: ""
    - table:
      - rowgroup:
        - row "Name Company Strength Packaging Details":
          - columnheader "Name"
          - columnheader "Company"
          - columnheader "Strength"
          - columnheader "Packaging"
          - columnheader "Details"
      - rowgroup:
        - row "Search for a medicin to see prices.":
          - cell "Search for a medicin to see prices."
    `);
  await page.getByTestId('sidebar-desktop-patients-link-open-button').click();
  await page.getByText('Patients Add Patient').click();
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - paragraph: Patients
    - button "Add Patient":
      - img
      - text: ""
    - table:
      - rowgroup:
        - row "Id Sort First name Sort Last name Sort Gender Sort CPR Number Sort Actions":
          - columnheader "Id Sort":
            - paragraph: Id
            - button "Sort":
              - img
            - textbox "Search Id..."
          - columnheader "First name Sort":
            - paragraph: First name
            - button "Sort":
              - img
            - textbox "Search First name..."
          - columnheader "Last name Sort":
            - paragraph: Last name
            - button "Sort":
              - img
            - textbox "Search Last name..."
          - columnheader "Gender Sort":
            - paragraph: Gender
            - button "Sort":
              - img
            - textbox "Search Gender..."
          - columnheader "CPR Number Sort":
            - paragraph: CPR Number
            - button "Sort":
              - img
            - textbox "Search CPR Number..."
          - columnheader "Actions":
            - paragraph: Actions
      - rowgroup:
        - row /1 michael conklin male \\d+-\\d+ Edit patient Delete patient/:
          - cell "1"
          - cell "michael"
          - cell "conklin"
          - cell "male"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /2 darlene kelly female \\d+-\\d+ Edit patient Delete patient/:
          - cell "2"
          - cell "darlene"
          - cell "kelly"
          - cell "female"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /3 edward reep male \\d+-\\d+ Edit patient Delete patient/:
          - cell "3"
          - cell "edward"
          - cell "reep"
          - cell "male"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /4 jennifer love female \\d+-\\d+ Edit patient Delete patient/:
          - cell "4"
          - cell "jennifer"
          - cell "love"
          - cell "female"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /5 eloise lininger female \\d+-\\d+ Edit patient Delete patient/:
          - cell "5"
          - cell "eloise"
          - cell "lininger"
          - cell "female"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /6 sharon miller female \\d+-\\d+ Edit patient Delete patient/:
          - cell "6"
          - cell "sharon"
          - cell "miller"
          - cell "female"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /7 phillip rape male \\d+-\\d+ Edit patient Delete patient/:
          - cell "7"
          - cell "phillip"
          - cell "rape"
          - cell "male"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /8 frances johnson female \\d+-\\d+ Edit patient Delete patient/:
          - cell "8"
          - cell "frances"
          - cell "johnson"
          - cell "female"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /9 rickey martin male \\d+-\\d+ Edit patient Delete patient/:
          - cell "9"
          - cell "rickey"
          - cell "martin"
          - cell "male"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /\\d+ mayra james female \\d+-\\d+ Edit patient Delete patient/:
          - cell /\\d+/
          - cell "mayra"
          - cell "james"
          - cell "female"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
    - paragraph: Rows per page
    - combobox:
      - option "5"
      - option /\\d+/ [selected]
      - option /\\d+/
      - option /\\d+/
    - img
    - navigation "pagination":
      - button "Previous page" [disabled]:
        - img
      - button "Page 1"
      - button "Page 2"
      - button "Page 3"
      - button "Next page":
        - img
    `);
  await page.getByTestId('patients-table-pagination-page-2').click();
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - paragraph: Patients
    - button "Add Patient":
      - img
      - text: ""
    - table:
      - rowgroup:
        - row "Id Sort First name Sort Last name Sort Gender Sort CPR Number Sort Actions":
          - columnheader "Id Sort":
            - paragraph: Id
            - button "Sort":
              - img
            - textbox "Search Id..."
          - columnheader "First name Sort":
            - paragraph: First name
            - button "Sort":
              - img
            - textbox "Search First name..."
          - columnheader "Last name Sort":
            - paragraph: Last name
            - button "Sort":
              - img
            - textbox "Search Last name..."
          - columnheader "Gender Sort":
            - paragraph: Gender
            - button "Sort":
              - img
            - textbox "Search Gender..."
          - columnheader "CPR Number Sort":
            - paragraph: CPR Number
            - button "Sort":
              - img
            - textbox "Search CPR Number..."
          - columnheader "Actions":
            - paragraph: Actions
      - rowgroup:
        - row /\\d+ kathleen russell female \\d+-\\d+ Edit patient Delete patient/:
          - cell /\\d+/
          - cell "kathleen"
          - cell "russell"
          - cell "female"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /\\d+ william andrews female \\d+-\\d+ Edit patient Delete patient/:
          - cell /\\d+/
          - cell "william"
          - cell "andrews"
          - cell "female"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /\\d+ fernando acosta male \\d+-\\d+ Edit patient Delete patient/:
          - cell /\\d+/
          - cell "fernando"
          - cell "acosta"
          - cell "male"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /\\d+ oliva rogers female \\d+-\\d+ Edit patient Delete patient/:
          - cell /\\d+/
          - cell "oliva"
          - cell "rogers"
          - cell "female"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /\\d+ joselyn hudnall female \\d+-\\d+ Edit patient Delete patient/:
          - cell /\\d+/
          - cell "joselyn"
          - cell "hudnall"
          - cell "female"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /\\d+ shirley walker female \\d+-\\d+ Edit patient Delete patient/:
          - cell /\\d+/
          - cell "shirley"
          - cell "walker"
          - cell "female"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /\\d+ garrett taylor male \\d+-\\d+ Edit patient Delete patient/:
          - cell /\\d+/
          - cell "garrett"
          - cell "taylor"
          - cell "male"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /\\d+ carl ellis male \\d+-\\d+ Edit patient Delete patient/:
          - cell /\\d+/
          - cell "carl"
          - cell "ellis"
          - cell "male"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /\\d+ patti jones female \\d+-\\d+ Edit patient Delete patient/:
          - cell /\\d+/
          - cell "patti"
          - cell "jones"
          - cell "female"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
        - row /\\d+ derrick williams male \\d+-\\d+ Edit patient Delete patient/:
          - cell /\\d+/
          - cell "derrick"
          - cell "williams"
          - cell "male"
          - cell /\\d+-\\d+/
          - cell "Edit patient Delete patient":
            - button "Edit patient":
              - img
            - button "Delete patient":
              - img
    - paragraph: Rows per page
    - combobox:
      - option "5"
      - option /\\d+/ [selected]
      - option /\\d+/
      - option /\\d+/
    - img
    - navigation "pagination":
      - button "Previous page":
        - img
      - button "Page 1"
      - button "Page 2"
      - button "Page 3"
      - button "Next page":
        - img
    `);
  await page.getByTestId('sidebar-desktop-shifts-link-open-button').click();
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - paragraph: this is Shifts page
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: /\\d+:\\d+/
    - paragraph: Mon
    - paragraph: Tue
    - paragraph: "Shift #1"
    - paragraph: /\\d+:\\d+ - \\d+:\\d+/
    - paragraph: "Shift #2"
    - paragraph: /\\d+:\\d+ - \\d+:\\d+\\.\\d+/
    - paragraph: Wed
    - paragraph: "Shift #3"
    - paragraph: /\\d+:\\d+ - \\d+:\\d+/
    - paragraph: "/Shift #\\\\d+/"
    - paragraph: /\\d+:\\d+ - \\d+:\\d+/
    - paragraph: Thu
    - paragraph: Fri
    - paragraph: Sat
    - paragraph: Sun
    `);
  await page.getByTestId('sidebar-desktop-treatment-link-open-button').click();
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - paragraph: Treatments
    - button "Add Treatment":
      - img
      - text: ""
    - table:
      - rowgroup:
        - row "Id Sort Patient Id Sort Description Sort Time Sort Actions":
          - columnheader "Id Sort":
            - paragraph: Id
            - button "Sort":
              - img
          - columnheader "Patient Id Sort":
            - paragraph: Patient Id
            - button "Sort":
              - img
            - textbox "Search Patient Id..."
          - columnheader "Description Sort":
            - paragraph: Description
            - button "Sort":
              - img
            - textbox "Search Description..."
          - columnheader "Time Sort":
            - paragraph: Time
            - button "Sort":
              - img
          - columnheader "Actions":
            - paragraph: Actions
      - rowgroup:
        - row /1 1 fever and headache \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell "1"
          - cell "1"
          - cell "fever and headache"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /2 2 bacterial infection \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell "2"
          - cell "2"
          - cell "bacterial infection"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /3 3 cholesterol check \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell "3"
          - cell "3"
          - cell "cholesterol check"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /4 4 asthma management \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell "4"
          - cell "4"
          - cell "asthma management"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /5 5 diabetes control \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell "5"
          - cell "5"
          - cell "diabetes control"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /6 6 blood pressure monitoring \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell "6"
          - cell "6"
          - cell "blood pressure monitoring"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /7 7 anxiety treatment \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell "7"
          - cell "7"
          - cell "anxiety treatment"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /8 8 acid reflux treatment \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell "8"
          - cell "8"
          - cell "acid reflux treatment"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /9 9 pain relief \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell "9"
          - cell "9"
          - cell "pain relief"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /\\d+ \\d+ steroid therapy \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "steroid therapy"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
    - paragraph: Rows per page
    - combobox:
      - option "5"
      - option /\\d+/ [selected]
      - option /\\d+/
      - option /\\d+/
    - img
    - navigation "pagination":
      - button "Previous page" [disabled]:
        - img
      - button "Page 1"
      - button "Page 2"
      - button "Page 3"
      - button "Page 4"
      - button "Next page":
        - img
    `);
  await expect(page.getByTestId('treatments-table-row-0-cell-description')).toContainText('fever and headache');
  await page.getByTestId('treatments-table-pagination-page-2').click();
  await expect(page.getByTestId('dashboard-main-content')).toMatchAriaSnapshot(`
    - paragraph: Treatments
    - button "Add Treatment":
      - img
      - text: ""
    - table:
      - rowgroup:
        - row "Id Sort Patient Id Sort Description Sort Time Sort Actions":
          - columnheader "Id Sort":
            - paragraph: Id
            - button "Sort":
              - img
          - columnheader "Patient Id Sort":
            - paragraph: Patient Id
            - button "Sort":
              - img
            - textbox "Search Patient Id..."
          - columnheader "Description Sort":
            - paragraph: Description
            - button "Sort":
              - img
            - textbox "Search Description..."
          - columnheader "Time Sort":
            - paragraph: Time
            - button "Sort":
              - img
          - columnheader "Actions":
            - paragraph: Actions
      - rowgroup:
        - row /\\d+ \\d+ asthma inhaler training \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "asthma inhaler training"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /\\d+ \\d+ sleep disorder assessment \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "sleep disorder assessment"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /\\d+ \\d+ blood thinner monitoring \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "blood thinner monitoring"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /\\d+ \\d+ neuropathy pain management \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "neuropathy pain management"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /\\d+ \\d+ depression treatment \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "depression treatment"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /\\d+ \\d+ heart disease check \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "heart disease check"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /\\d+ \\d+ pediatric care \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "pediatric care"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /\\d+ \\d+ radiology imaging \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "radiology imaging"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /\\d+ \\d+ surgery post-op care \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "surgery post-op care"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
        - row /\\d+ \\d+ emergency care \\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+ Edit treatment Delete treatment/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "emergency care"
          - cell /\\d+\\/\\d+\\/\\d+, \\d+:\\d+:\\d+/
          - cell "Edit treatment Delete treatment":
            - button "Edit treatment":
              - img
            - button "Delete treatment":
              - img
    - paragraph: Rows per page
    - combobox:
      - option "5"
      - option /\\d+/ [selected]
      - option /\\d+/
      - option /\\d+/
    - img
    - navigation "pagination":
      - button "Previous page":
        - img
      - button "Page 1"
      - button "Page 2"
      - button "Page 3"
      - button "Page 4"
      - button "Next page":
        - img
    `);
});