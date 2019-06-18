const prettyBytes = require('prettier-bytes')
const { h } = require('preact')
const classNames = require('classnames')

const getFileNameAndExtension = require('@uppy/utils/lib/getFileNameAndExtension')
const truncateString = require('../../utils/truncateString')

const FileProgress = require('./components/FileProgress')
const FilePreviewAndLink = require('./components/FilePreviewAndLink')
const CopyLinkButton = require('./components/CopyLinkButton')
const FileSource = require('./components/FileSource')
const RemoveButton = require('./components/RemoveButton')

module.exports = function FileItem (props) {
  const file = props.file

  const isProcessing = file.progress.preprocess || file.progress.postprocess
  const isUploaded = file.progress.uploadComplete && !isProcessing && !file.error
  const uploadInProgressOrComplete = file.progress.uploadStarted || isProcessing
  const uploadInProgress = (file.progress.uploadStarted && !file.progress.uploadComplete) || isProcessing
  const isPaused = file.isPaused || false
  const error = file.error || false

  const fileName = getFileNameAndExtension(file.meta.name).name
  const truncatedFileName = props.isWide ? truncateString(fileName, 30) : fileName

  const showRemoveButton = props.individualCancellation
    ? !isUploaded
    : !uploadInProgress && !isUploaded

  const dashboardItemClass = classNames(
    'uppy-DashboardItem',
    { 'is-inprogress': uploadInProgress },
    { 'is-processing': isProcessing },
    { 'is-complete': isUploaded },
    { 'is-paused': isPaused },
    { 'is-error': error },
    { 'is-resumable': props.resumableUploads },
    { 'is-noIndividualCancellation': !props.individualCancellation }
  )

  const renderFileName = () =>
    <div class="uppy-DashboardItem-name">
      {file.extension ? truncatedFileName + '.' + file.extension : truncatedFileName}
    </div>

  const renderFilePreviewAndLink = () =>
    <FilePreviewAndLink
      file={file}
      showLinkToFileUploadResult={props.showLinkToFileUploadResult}
    />

  const renderFileProgress = () =>
    <FileProgress
      error={error}
      isUploaded={isUploaded}
      {...props}
    />

  const renderFileSize = () => (
    file.data.size &&
    <div class="uppy-DashboardItem-statusSize">
      {prettyBytes(file.data.size)}
    </div>
  )

  const renderFileSource = () =>
    <FileSource
      file={file}
      id={props.id}
      acquirers={props.acquirers}
      i18n={props.i18n}
    />

  const renderEditButton = () => (
    !uploadInProgressOrComplete &&
    props.metaFields &&
    props.metaFields.length &&
    <button class="uppy-u-reset uppy-DashboardItem-edit"
      type="button"
      aria-label={props.i18n('editFile') + ' ' + fileName}
      title={props.i18n('editFile')}
      onclick={(e) => props.toggleFileCard(file.id)}
    >
      {props.i18n('edit')}
    </button>
  )

  const renderRemoveButton = () =>
    <RemoveButton
      file={file}
      showRemoveButton={showRemoveButton}
      removeFile={props.removeFile}
      i18n={props.i18n}
    />

  const renderCopyLinkButton = () =>
    <CopyLinkButton
      file={file}
      showLinkToFileUploadResult={props.showLinkToFileUploadResult}
      i18n={props.i18n}
      log={props.log}
      info={props.info}
    />

  return (
    <li class={dashboardItemClass} id={`uppy_${file.id}`}>
      <div class="uppy-DashboardItem-preview">
        {renderFilePreviewAndLink()}
        {renderFileProgress()}
      </div>

      <div class="uppy-DashboardItem-info">
        {renderFileName()}
        <div class="uppy-DashboardItem-status">
          {renderFileSize()}
          {renderFileSource()}

          {renderEditButton()}
          {renderCopyLinkButton()}
        </div>
      </div>

      <div class="uppy-DashboardItem-action">
        {renderRemoveButton()}
      </div>
    </li>
  )
}
