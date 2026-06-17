import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import {
  ActionRow,
  Alert,
  Button,
  Card,
  Dropdown,
  Icon,
  Form,
  IconButton,
  ModalDialog,
  Stack,
  useToggle,
} from '@openedx/paragon';
import {
  ArrowForward,
  DeleteOutline,
  Edit as EditIcon,
  Launch,
  MoreHoriz,
} from '@openedx/paragon/icons';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { Link } from 'react-router-dom';

import { useWaffleFlags } from '@src/data/apiHooks';
import { COURSE_CREATOR_STATES } from '@src/constants';
import classNames from 'classnames';
import { getStudioHomeData } from '../data/selectors';
import { deleteCourse } from '../data/api';
import messages from '../messages';

export const PrevToNextName = ({ from, to }: { from: React.ReactNode; to?: React.ReactNode; }) => (
  <Stack direction="horizontal" gap={2}>
    <span>{from}</span>
    {to
      && (
        <>
          <Icon src={ArrowForward} size="xs" className="mb-1" />
          <span>{to}</span>
        </>
      )}
  </Stack>
);

export const MakeLinkOrSpan = ({
  when,
  to,
  children,
  className,
}: {
  when: boolean;
  to: string;
  children: React.ReactNode;
  className?: string;
}) => {
  if (when) {
    return <Link className={className} to={to}>{children}</Link>;
  }
  return <span className={className}>{children}</span>;
};

interface CardTitleProps {
  readOnlyItem: boolean;
  selectMode?: 'single' | 'multiple';
  destinationUrl: string;
  title: string;
  secondaryLink?: ReactElement | null;
  itemId?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({
  readOnlyItem,
  selectMode,
  destinationUrl,
  title,
  secondaryLink,
  itemId,
}) => {
  const getTitle = useCallback(() => (
    <div style={{ marginTop: selectMode ? '-3px' : '' }}>
      <PrevToNextName
        from={
          <MakeLinkOrSpan
            when={!readOnlyItem && !selectMode}
            to={destinationUrl}
            className="card-item-title"
          >
            {title}
          </MakeLinkOrSpan>
        }
        to={secondaryLink}
      />
    </div>
  ), [
    readOnlyItem,
    destinationUrl,
    title,
    selectMode,
  ]);

  if (selectMode) {
    if (selectMode === 'single') {
      return (
        <Form.Radio
          className="mt-1 ml-1"
          value={itemId}
          name={`select-card-item-${itemId}`}
          style={{ marginBottom: '-20px' }}
        >
          {getTitle()}
        </Form.Radio>
      );
    }
    // Multiple
    return (
      <Form.Checkbox
        className="mt-1 ml-1"
        value={itemId}
      >
        {getTitle()}
      </Form.Checkbox>
    );
  }
  return getTitle();
};

interface CardMenuProps {
  showMenu: boolean;
  isShowRerunLink?: boolean;
  rerunLink: string | null;
  lmsLink: string | null;
  showDelete?: boolean;
  onDelete?: () => void;
}

const CardMenu = ({
  showMenu,
  isShowRerunLink,
  rerunLink,
  lmsLink,
  showDelete = false,
  onDelete,
}: CardMenuProps) => {
  const intl = useIntl();

  if (!showMenu) {
    return null;
  }

  return (
    <Dropdown>
      <Dropdown.Toggle
        as={IconButton}
        iconAs={MoreHoriz}
        variant="primary"
        aria-label={intl.formatMessage(messages.btnDropDownText)}
      />
      <Dropdown.Menu>
        {isShowRerunLink && (
          <Dropdown.Item
            as={Link}
            to={rerunLink ?? ''}
          >
            <FormattedMessage {...messages.btnReRunText} />
          </Dropdown.Item>
        )}
        <Dropdown.Item href={lmsLink}>
          <FormattedMessage {...messages.viewLiveBtnText} />
        </Dropdown.Item>
        {showDelete && (
          <>
            <Dropdown.Divider />
            <Dropdown.Item className="text-danger" onClick={onDelete}>
              <Icon src={DeleteOutline} className="mr-2" />
              <FormattedMessage {...messages.deleteCourseBtnText} />
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const SelectAction = ({
  itemId,
  title,
  selectMode,
}: {
  itemId: string;
  title: string;
  selectMode: 'single' | 'multiple';
}) => {
  if (selectMode === 'single') {
    return (
      <Form.Radio
        value={itemId}
        aria-label={title}
        name={`select-card-item-${itemId}`}
      />
    );
  }

  // Multiple
  return <Form.Checkbox value={itemId} aria-label={title} />;
};

interface BaseProps {
  displayName: string;
  onClick?: () => void;
  org: string;
  number: string;
  run?: string;
  lmsLink?: string | null;
  rerunLink?: string | null;
  courseKey?: string;
  isLibraries?: boolean;
  subtitleWrapper?: ((subtitle: JSX.Element) => ReactElement) | null; // Wrapper for the default subtitle element
  subtitleBeforeWidget?: ReactElement | null; // Adds a widget before the default subtitle element
  cardStatusWidget?: ReactElement | null;
  titleSecondaryLink?: ReactElement | null;
  selectMode?: 'single' | 'multiple';
  selectPosition?: 'card' | 'title';
  isSelected?: boolean;
  itemId?: string;
  scrollIntoView?: boolean;
  /** Called after a course is successfully deleted, so the list can refresh. */
  onDeleted?: () => void;
}

type Props =
  & BaseProps
  & (
    /** If we should open this course/library in this MFE, this is the path to the edit page, e.g. '/course/foo' */
    | { path: string; url?: never; }
    | /**
     * If we might be redirecting to the legacy Studio view, this is the URL to redirect to.
     * URLs starting with '/' are assumed to be relative to the legacy Studio root.
     */ { url: string; path?: never; }
  );

/**
 * A card on the Studio home page that represents a Course or a Library
 */
export const CardItem: React.FC<Props> = ({
  displayName,
  onClick,
  lmsLink = '',
  rerunLink = '',
  org,
  number,
  run = '',
  isLibraries = false,
  courseKey = '',
  selectMode,
  selectPosition,
  isSelected = false,
  itemId = '',
  path,
  url,
  subtitleWrapper,
  subtitleBeforeWidget,
  titleSecondaryLink,
  cardStatusWidget,
  scrollIntoView = false,
  onDeleted,
}) => {
  const intl = useIntl();
  const {
    allowCourseReruns,
    courseCreatorStatus,
    rerunCreatorStatus,
  } = useSelector(getStudioHomeData);
  const waffleFlags = useWaffleFlags();
  const cardRef = useRef<HTMLDivElement>(null);

  const [isDeleteOpen, openDelete, closeDelete] = useToggle(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const destinationUrl: string = path ?? (
    waffleFlags.useNewCourseOutlinePage && !isLibraries
      ? url
      : new URL(url, getConfig().STUDIO_BASE_URL).toString()
  );
  const isExternalUrl = /^https?:\/\//i.test(destinationUrl);
  const readOnlyItem = !(lmsLink || rerunLink || url || path);
  const showActionsMenu = !(readOnlyItem || isLibraries || selectMode !== undefined);

  const handleOpenDelete = useCallback(() => {
    setConfirmText('');
    setDeleteErrorMsg('');
    openDelete();
  }, [openDelete]);

  const handleCloseDelete = useCallback(() => {
    setConfirmText('');
    closeDelete();
  }, [closeDelete]);

  const handleConfirmDelete = useCallback(async () => {
    setIsDeleting(true);
    setDeleteErrorMsg('');
    try {
      await deleteCourse(courseKey);
      handleCloseDelete();
      onDeleted?.();
    } catch (err) {
      // Surface the backend message when present (e.g. a 403 permission denial
      // vs a generic 500) so the user understands why the delete was refused.
      const backendMsg = (err as { response?: { data?: { error?: string; }; }; })?.response?.data?.error;
      setDeleteErrorMsg(
        typeof backendMsg === 'string' && backendMsg
          ? backendMsg
          : intl.formatMessage(messages.deleteCourseError),
      );
    } finally {
      setIsDeleting(false);
    }
  }, [courseKey, onDeleted, handleCloseDelete, intl]);
  const isShowRerunLink = allowCourseReruns
    && rerunCreatorStatus
    && courseCreatorStatus === COURSE_CREATOR_STATES.granted;
  const title = (displayName ?? '').trim().length ? displayName : courseKey;
  // Require the user to type the exact course name before the destructive
  // delete is enabled (guards against an accidental single click).
  const canConfirmDelete = confirmText.trim() === (title ?? '').trim() && !isDeleting;

  const getSubtitle = useCallback(() => {
    let subtitle = isLibraries ? <>{org} / {number}</> : <>{org} / {number} / {run}</>;
    if (subtitleWrapper) {
      subtitle = subtitleWrapper(subtitle);
    }
    if (subtitleBeforeWidget) {
      subtitle = (
        <Stack direction="horizontal" gap={2}>
          {subtitleBeforeWidget}
          {subtitle}
        </Stack>
      );
    }
    return subtitle;
  }, [isLibraries, org, number, run]);

  useEffect(() => {
    /* istanbul ignore next */
    if (scrollIntoView && cardRef.current && 'scrollIntoView' in cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollIntoView]);

  return (
    <div ref={cardRef} className="w-100 h-100">
      <Card
        onClick={onClick}
        className={classNames('card-item h-100', {
          selected: isSelected,
        })}
      >
        <Card.Header
          size="sm"
          title={
            <CardTitle
              readOnlyItem={readOnlyItem || selectMode !== undefined}
              selectMode={selectPosition === 'title' ? selectMode : undefined}
              destinationUrl={destinationUrl}
              title={title}
              itemId={itemId}
              secondaryLink={titleSecondaryLink}
            />
          }
          subtitle={getSubtitle()}
          actions={(selectMode && selectPosition === 'card') ?
            (
              <SelectAction
                itemId={itemId}
                selectMode={selectMode}
                title={title}
              />
            ) :
            (
              <CardMenu
                showMenu={showActionsMenu}
                isShowRerunLink={isShowRerunLink}
                rerunLink={rerunLink}
                lmsLink={lmsLink}
                showDelete={showActionsMenu}
                onDelete={handleOpenDelete}
              />
            )}
        />
        {cardStatusWidget && (
          <Card.Status className="bg-white pt-0 text-gray-500">
            {cardStatusWidget}
          </Card.Status>
        )}
        {showActionsMenu && (
          <Card.Footer className="card-item-footer bg-white pt-0 justify-content-end">
            {isExternalUrl ?
              (
                <Button
                  as="a"
                  href={destinationUrl}
                  variant="outline-primary"
                  size="sm"
                  iconBefore={EditIcon}
                >
                  {intl.formatMessage(messages.editBtnText)}
                </Button>
              ) :
              (
                <Button
                  as={Link}
                  to={destinationUrl}
                  variant="outline-primary"
                  size="sm"
                  iconBefore={EditIcon}
                >
                  {intl.formatMessage(messages.editBtnText)}
                </Button>
              )}
            {lmsLink && (
              <Button
                variant="tertiary"
                size="sm"
                iconBefore={Launch}
                as="a"
                href={lmsLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {intl.formatMessage(messages.viewLiveBtnText)}
              </Button>
            )}
          </Card.Footer>
        )}
      </Card>
      <ModalDialog
        title={intl.formatMessage(messages.deleteCourseModalTitle)}
        isOpen={isDeleteOpen}
        onClose={handleCloseDelete}
        hasCloseButton
        isBlocking
        isOverflowVisible={false}
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            {intl.formatMessage(messages.deleteCourseModalTitle)}
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          {deleteErrorMsg && (
            <Alert variant="danger">
              {deleteErrorMsg}
            </Alert>
          )}
          <p>{intl.formatMessage(messages.deleteCourseModalBody, { title })}</p>
          <Form.Group>
            <Form.Label>
              {intl.formatMessage(messages.deleteCourseModalConfirmPrompt)} <strong>{title}</strong>
            </Form.Label>
            <Form.Control
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={intl.formatMessage(messages.deleteCourseModalConfirmPlaceholder)}
              disabled={isDeleting}
              autoComplete="off"
            />
          </Form.Group>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton variant="tertiary" disabled={isDeleting}>
              {intl.formatMessage(messages.deleteCourseModalCancel)}
            </ModalDialog.CloseButton>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={!canConfirmDelete}
            >
              {intl.formatMessage(messages.deleteCourseModalConfirm)}
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </div>
  );
};
