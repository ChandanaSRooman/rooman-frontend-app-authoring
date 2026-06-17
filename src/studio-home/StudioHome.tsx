import React, { useCallback } from 'react';
import {
  Button,
  Container,
  Icon,
  MailtoLink,
  Row,
} from '@openedx/paragon';
import { Add as AddIcon, Error, ManageAccounts } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { StudioFooterSlot } from '@edx/frontend-component-footer';
import { useLocation, useNavigate } from 'react-router-dom';

import Loading from '../generic/Loading';
import InternetConnectionAlert from '../generic/internet-connection-alert';
import Header from '../header';
import TabsSection from './tabs-section';
import OrganizationSection from './organization-section';
import VerifyEmailLayout from './verify-email-layout';
import messages from './messages';
import { useStudioHome } from './hooks';
import AlertMessage from '../generic/alert-message';

// Rooman: "New course" routes to the Syllabus Agent (Rooman's course-creation
// flow) instead of Studio's built-in new-course form. The URL is configurable
// via the MFE runtime config key ROOMAN_SYLLABUS_URL; falls back to the dev host.
const goToRoomanSyllabus = () => {
  const cfg = getConfig() as { ROOMAN_SYLLABUS_URL?: string; };
  window.location.assign(
    cfg.ROOMAN_SYLLABUS_URL || 'https://dev-labs.13-232-120-92.sslip.io/syllabus/',
  );
};

const StudioHome = () => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    isLoadingPage,
    isFailedLoadingPage,
    studioHomeData,
    isShowProcessing,
    anyQueryIsFailed,
    isShowEmailStaff,
    anyQueryIsPending,
    showNewCourseContainer,
    isShowOrganizationDropdown,
    hasAbilityToCreateNewCourse,
    isFiltered,
    librariesV1Enabled,
    librariesV2Enabled,
  } = useStudioHome();

  const adminConsoleUrl = `${getConfig().ADMIN_CONSOLE_URL}/authz`;

  const v1LibraryTab = librariesV1Enabled && location?.pathname.split('/').pop() === 'libraries-v1';
  const showV2LibraryURL = librariesV2Enabled && !v1LibraryTab;

  const {
    userIsActive,
    studioShortName,
    studioRequestEmail,
    showNewLibraryButton,
    showNewLibraryV2Button,
  } = studioHomeData;

  const getHeaderButtons = useCallback(() => {
    const headerButtons: JSX.Element[] = [];

    if (isFailedLoadingPage || !userIsActive) {
      return headerButtons;
    }

    if (isShowEmailStaff) {
      headerButtons.push(
        <MailtoLink to={studioRequestEmail}>{intl.formatMessage(messages.emailStaffBtnText)}</MailtoLink>,
      );
    }

    headerButtons.push(
      <div className="border-right mr-3 pr-4 py-2">
        <Button
          as="a"
          href={adminConsoleUrl}
          variant="primary"
          iconBefore={ManageAccounts}
          size="sm"
          target="_blank"
        >
          {intl.formatMessage(messages.addRolesPermissionsBtnText)}
        </Button>
      </div>,
    );

    if (hasAbilityToCreateNewCourse) {
      headerButtons.push(
        <Button
          variant="outline-primary"
          iconBefore={AddIcon}
          size="sm"
          onClick={goToRoomanSyllabus}
        >
          {intl.formatMessage(messages.addNewCourseBtnText)}
        </Button>,
      );
    }

    if ((showNewLibraryButton && !showV2LibraryURL) || (showV2LibraryURL && showNewLibraryV2Button)) {
      const newLibraryClick = () => {
        if (showV2LibraryURL) {
          navigate('/library/create');
        } else {
          navigate('/libraries-v1/create');
        }
      };

      headerButtons.push(
        <Button
          variant="outline-primary"
          iconBefore={AddIcon}
          size="sm"
          onClick={newLibraryClick}
        >
          {intl.formatMessage(messages.addNewLibraryBtnText)}
        </Button>,
      );
    }

    return headerButtons;
  }, [location, userIsActive, isFailedLoadingPage]);

  const headerButtons = userIsActive ? getHeaderButtons() : [];
  if (isLoadingPage && !isFiltered) {
    return <Loading />;
  }

  const getMainBody = () => {
    if (isFailedLoadingPage) {
      return (
        <AlertMessage
          variant="danger"
          description={
            <Row className="m-0 align-items-center">
              <Icon src={Error} className="text-danger-500 mr-1" />
              <span>{intl.formatMessage(messages.homePageLoadFailedMessage)}</span>
            </Row>
          }
        />
      );
    }
    if (!userIsActive) {
      return <VerifyEmailLayout />;
    }
    return (
      <section>
        {isShowOrganizationDropdown && <OrganizationSection />}
        <TabsSection
          showNewCourseContainer={showNewCourseContainer}
          onClickNewCourse={goToRoomanSyllabus}
          isShowProcessing={Boolean(isShowProcessing) && !isFiltered}
          librariesV1Enabled={librariesV1Enabled}
          librariesV2Enabled={librariesV2Enabled}
        />
      </section>
    );
  };

  const showHeaderActions = userIsActive && !isFailedLoadingPage;

  return (
    <>
      {/* Single merged header: the studio nav bar (logo + search + account) with
          the page title and primary actions injected into its empty middle. */}
      <div className="studio-home-header-bar">
        <Header isHiddenMainMenu />
        {showHeaderActions && (
          <Container size="xl" className="studio-home-header-bar__overlay px-2.5">
            <h1 className="studio-home-header-bar__title">
              {intl.formatMessage(messages.headingTitle, { studioShortName: studioShortName || 'Studio' })}
            </h1>
            <div className="studio-home-header-bar__spacer" />
            <div className="studio-home-header-bar__actions">
              {headerButtons.map((button, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={index}>{button}</React.Fragment>
              ))}
            </div>
          </Container>
        )}
      </div>
      <Container size="xl" className="p-4 mt-3">
        <section className="mb-4">
          {getMainBody()}
        </section>
      </Container>
      <div className="alert-toast">
        <InternetConnectionAlert
          isFailed={anyQueryIsFailed}
          isQueryPending={anyQueryIsPending}
        />
      </div>
      <StudioFooterSlot />
    </>
  );
};

export default StudioHome;
