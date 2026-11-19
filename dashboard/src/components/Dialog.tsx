import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import {
  createReply,
  deleteOne,
  updateStatus,
} from "../services/MessagesService";
import { StatutMessage } from "../types/DomainTypes";
import { sendVisitEmail } from "../services/visiteurService";
import TextField from "@mui/material/TextField";

interface CommonDialogProps {
  open: boolean;
  onClose: () => void;
  setRefreshToken: React.Dispatch<React.SetStateAction<number>>;
  setActionError: (error: string | null) => void;
}

type ResponsiveDialogProps = CommonDialogProps &
  (
    | {
        mode: "reply";
        messageId: number;
        content: string;
        status: StatutMessage;
      }
    | {
        mode: "email";
        visitorId: number;
        recipientName: string;
        recipientEmail: string;
      }
  );

export default function ResponsiveDialog({
  open,
  onClose,
  setRefreshToken,
  setActionError,
  ...dialogProps
}: ResponsiveDialogProps) {
  const theme = useTheme();
  const [reply, setReply] = React.useState<boolean>(false);
  const [replyContent, setReplyContent] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sentTo, setSentTo] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isEmailMode = dialogProps.mode === "email";

  const closeDialog = React.useCallback(() => {
    setReply(false);
    setReplyContent("");
    setSubject("");
    setSentTo(null);
    setSubmitError(null);
    onClose();
  }, [onClose]);
  const handleDelete = React.useCallback(
    async (id: number) => {
      setActionError(null);
      try {
        await deleteOne(id);
        setRefreshToken((current) => current + 1);
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "Impossible de supprimer ce message.",
        );
      }
    },
    [setActionError, setRefreshToken],
  );

  const handleChangeStatus = React.useCallback(
    async (id: number, newStatus: StatutMessage) => {
      setActionError(null);
      try {
        await updateStatus(id, newStatus);
        setRefreshToken((current) => current + 1);
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "Impossible de modifier le statut du message.",
        );
      }
    },
    [setActionError, setRefreshToken],
  );

  const handleSubmit = React.useCallback(async () => {
    const contenu = replyContent.trim();
    if (!contenu) return;

    setSubmitError(null);
    setActionError(null);
    setIsSubmitting(true);
    try {
      if (dialogProps.mode === "email") {
        await sendVisitEmail(dialogProps.visitorId, subject.trim(), contenu);
        setSentTo(dialogProps.recipientEmail);
      } else {
        await createReply(dialogProps.messageId, contenu);
        setRefreshToken((current) => current + 1);
        setReply(false);
        onClose();
      }
      setReplyContent("");
      setSubject("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Impossible d’envoyer le message.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    dialogProps,
    onClose,
    replyContent,
    setActionError,
    setRefreshToken,
    subject,
  ]);

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={closeDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {isEmailMode ? "Nouveau courriel" : "Message"}
        </DialogTitle>
        <DialogContent>
          {isEmailMode && sentTo ? (
            <Alert severity="success">
              Le courriel a été envoyé à {sentTo}.
            </Alert>
          ) : isEmailMode ? (
            <Box>
              {submitError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {submitError}
                </Alert>
              )}
              <Alert severity="info" sx={{ mb: 2 }}>
                Destinataire : {dialogProps.recipientName} (
                {dialogProps.recipientEmail})
              </Alert>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSubmit();
                }}
                id="visit-email-form"
              >
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  label="Objet"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  fullWidth
                />
                <TextField
                  required
                  margin="dense"
                  label="Votre message"
                  value={replyContent}
                  onChange={(event) => setReplyContent(event.target.value)}
                  minRows={6}
                  multiline
                  fullWidth
                />
              </form>
            </Box>
          ) : !reply ? (
            <DialogContentText>
              <span style={{ whiteSpace: "pre-line" }}>{dialogProps.content}</span>
            </DialogContentText>
          ) : (
            <Box>
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSubmit();
              }}
              id="message-reply-form"
            >
              <TextField
                autoFocus
                required
                margin="dense"
                id="response"
                name="response"
                label="Rédigez une réponse"
                type="text"
                value={replyContent}
                onChange={(event) => setReplyContent(event.target.value)}
                minRows={6}
                multiline
                fullWidth
                variant="standard"
              />
            </form>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {isEmailMode ? (
            sentTo ? (
              <Button onClick={closeDialog}>Fermer</Button>
            ) : (
              <>
                <Button
                  type="submit"
                  form="visit-email-form"
                  disabled={
                    isSubmitting || !subject.trim() || !replyContent.trim()
                  }
                >
                  {isSubmitting ? "Envoi…" : "Envoyer"}
                </Button>
                <Button onClick={closeDialog} disabled={isSubmitting}>
                  Annuler
                </Button>
              </>
            )
          ) : !reply ? (
            <>
              {dialogProps.status === StatutMessage.NON_LU && (
                <Button
                  autoFocus
                  onClick={() => {
                    void handleChangeStatus(
                      dialogProps.messageId,
                      StatutMessage.LU,
                    );
                    closeDialog();
                  }}
                >
                  Marquer comme lu
                </Button>
              )}
              <Button
                onClick={() => {
                  setReply(true);
                }}
                autoFocus
              >
                Répondre
              </Button>
              <Button
                onClick={() => {
                  void handleDelete(dialogProps.messageId);
                  closeDialog();
                }}
                autoFocus
              >
                Supprimer
              </Button>
            </>
          ) : (
            <>
              <Button
                type="submit"
                form="message-reply-form"
                autoFocus
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? "Envoi…" : "Envoyer"}
              </Button>

              <Button
                onClick={() => {
                  setReply(false);
                  closeDialog();
                }}
                autoFocus
              >
                Annuler
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
