import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  headingTitle: {
    id: 'course-authoring.studio-home.heading.title',
    defaultMessage: '{studioShortName} home',
  },
  addNewCourseBtnText: {
    id: 'course-authoring.studio-home.add-new-course.btn.text',
    defaultMessage: 'New course',
  },
  addNewLibraryBtnText: {
    id: 'course-authoring.studio-home.add-new-library.btn.text',
    defaultMessage: 'New library',
  },
  addRolesPermissionsBtnText: {
    id: 'course-authoring.studio-home.add-roles-permissions.btn.text',
    defaultMessage: 'Roles and permissions',
    description: 'Text for the button that links to the Admin Console Roles and Permissions page.',
  },
  homePageLoadFailedMessage: {
    id: 'course-authoring.studio-home.page-load.failed.message',
    defaultMessage: 'Failed to load Studio home. Please try again later.',
  },
  emailStaffBtnText: {
    id: 'course-authoring.studio-home.email-staff.btn.text',
    defaultMessage: 'Email staff to create course',
  },
  defaultSection_1_Title: {
    id: 'course-authoring.studio-home.default-section-1.title',
    defaultMessage: 'Are you staff on an existing {studioShortName} course?',
  },
  defaultSection_1_Description: {
    id: 'course-authoring.studio-home.default-section-1.description',
    defaultMessage: 'The course creator must give you access to the course. Contact the course creator or administrator for the course you are helping to author.',
  },
  defaultSection_2_Title: {
    id: 'course-authoring.studio-home.default-section-2.title',
    defaultMessage: 'Create your first course',
  },
  defaultSection_2_Description: {
    id: 'course-authoring.studio-home.default-section-2.description',
    defaultMessage: 'Your new course is just a click away!',
  },
  btnAddNewCourseText: {
    id: 'course-authoring.studio-home.btn.add-new-course.text',
    defaultMessage: 'Create your first course',
  },
  btnReRunText: {
    id: 'course-authoring.studio-home.btn.re-run.text',
    defaultMessage: 'Re-run course',
  },
  btnDropDownText: {
    id: 'course-authoring.studio-home.btn.dropdown.text',
    defaultMessage: 'Course actions',
  },
  viewLiveBtnText: {
    id: 'course-authoring.studio-home.btn.view-live.text',
    defaultMessage: 'View live',
  },
  editBtnText: {
    id: 'course-authoring.studio-home.btn.edit.text',
    defaultMessage: 'Edit',
    description: 'Label for the button on a course card that opens the course in Studio.',
  },
  deleteCourseBtnText: {
    id: 'course-authoring.studio-home.btn.delete-course.text',
    defaultMessage: 'Delete course',
    description: 'Label for the course-card menu item that deletes the course.',
  },
  deleteCourseModalTitle: {
    id: 'course-authoring.studio-home.delete-course.modal.title',
    defaultMessage: 'Delete this course?',
  },
  deleteCourseModalBody: {
    id: 'course-authoring.studio-home.delete-course.modal.body',
    defaultMessage: 'Are you sure you want to delete "{title}"? This permanently removes the course and all of its content. This action cannot be undone.',
  },
  deleteCourseModalConfirmPrompt: {
    id: 'course-authoring.studio-home.delete-course.modal.confirm-prompt',
    defaultMessage: 'To confirm, type the course name below:',
    description: 'Instruction telling the user to type the course name to enable the delete button.',
  },
  deleteCourseModalConfirmPlaceholder: {
    id: 'course-authoring.studio-home.delete-course.modal.confirm-placeholder',
    defaultMessage: 'Course name',
  },
  deleteCourseModalCancel: {
    id: 'course-authoring.studio-home.delete-course.modal.cancel',
    defaultMessage: 'Cancel',
  },
  deleteCourseModalConfirm: {
    id: 'course-authoring.studio-home.delete-course.modal.confirm',
    defaultMessage: 'Delete course',
  },
  deleteCourseError: {
    id: 'course-authoring.studio-home.delete-course.error',
    defaultMessage: 'Failed to delete the course. Please try again.',
  },
  organizationTitle: {
    id: 'course-authoring.studio-home.organization.title',
    defaultMessage: 'Organization and library settings',
  },
  organizationLabel: {
    id: 'course-authoring.studio-home.organization.label',
    defaultMessage: 'Show all courses in organization:',
  },
  organizationSubmitBtnText: {
    id: 'course-authoring.studio-home.organization.btn.submit.text',
    defaultMessage: 'Submit',
  },
  organizationInputPlaceholder: {
    id: 'course-authoring.studio-home.organization.input.placeholder',
    defaultMessage: 'For example, MITx',
  },
  organizationInputNoOptions: {
    id: 'course-authoring.studio-home.organization.input.no-options',
    defaultMessage: 'No options',
  },
});

export default messages;
