import { useState } from "react";
import { auth, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "../firebase";
import styles from "../../styles/Profile/profileNavSections.module.css";

function DangerZone() {
  const [typeOfDeletion, setTypeOfDeletion] = useState("");
  const [popupTimeout, setPopupTimeout] = useState(null);

  function openOrCloseDangerZonePopup(closing = false) {
    const deleteAccountButton = document.getElementById("deleteAccountButton");
    const deleteStatsButton = document.getElementById("deleteStatsButton");
    const dangerZonePopup = document.querySelector(`.${styles.dangerZonePopup}`);
    const passwordInput = document.getElementById("passwordPopupInput");
    const dangerZoneCountdownLine = document.querySelector(`.${styles.dangerZonePopupCountdownLine}`);

    if (closing) {
      dangerZonePopup.classList.remove(styles.visible);
      passwordInput.value = "";
      passwordInput.blur();
      dangerZoneCountdownLine.classList.remove(styles.countingDown);
      deleteAccountButton.disabled = false;
      deleteStatsButton.disabled = false;
      clearTimeout(popupTimeout);
    } else {
      dangerZonePopup.classList.add(styles.visible);
      passwordInput.focus();
      dangerZoneCountdownLine.classList.add(styles.countingDown);
      deleteAccountButton.disabled = true;
      deleteStatsButton.disabled = true;

      setPopupTimeout(
        setTimeout(() => {
          dangerZonePopup.classList.remove(styles.visible);
          dangerZoneCountdownLine.classList.remove(styles.countingDown);
          deleteAccountButton.disabled = false;
          deleteStatsButton.disabled = false;
        }, 15000)
      );
    }
  }

  function deleteAccountOrDeleteStats(isStats = false) {
    const dangerZoneCountdownLine = document.querySelector(`.${styles.dangerZonePopupCountdownLine}`);
    dangerZoneCountdownLine.classList.remove(styles.countingDown);
    clearTimeout(popupTimeout);

    if (isStats) {
      // add removing of statistics from account
      console.log("deleting account stats");
    } else {
      const passwordInput = document.getElementById("passwordPopupInput");
      const userPassword = passwordInput.value;

      if (!userPassword) return;

      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(auth.currentUser.email, userPassword);

      reauthenticateWithCredential(user, credential)
        .then(() => {
          deleteUser(user)
            .then(() => {
              // Account deleted.
              alert("Account deleted");
              console.log("Account deleted.");
            })
            .catch((error) => {
              // An error happened.
              alert("Error deleting account");
              console.log(error);
            });
        })
        .catch((error) => {
          // An error happened.
          alert("Error authenticating with given credentials");
          console.log(error);
        });
    }
  }
  return (
    <section>
      <article className={styles.navSectionContentArticle}>
        <div className={styles.titleAndDescriptionContainer}>
          <h3 className={styles.articleTitle}>Danger Zone</h3>
          <p className={styles.articleDescription}>
            Thread carrefully while altering the following settings. Choosing to proceed with said settings
            will result in permanent changes to your account, some of which will result in losing some or all
            account data. Please be careful.
          </p>
        </div>

        <div className={styles.articleContent}>
          <div className={styles.dangerZoneContainer}>
            <div className={styles.dangerZoneItem}>
              <h4 className={styles.dangerZoneItemTitle}>Delete Account</h4>
              <p className={styles.dangerZoneItemDescription}>
                Remove all data stored in our database and delete your account. This action is irreversible
                and cannot be undone.
              </p>
              <button
                type="button"
                id="deleteAccountButton"
                className={`${styles.articleButton} ${styles.dangerZoneArticleButton}`}
                onClick={() => {
                  setTypeOfDeletion("account");
                  openOrCloseDangerZonePopup();
                }}
              >
                Delete account
              </button>
            </div>

            <div className={styles.dangerZoneItem}>
              <h4 className={styles.dangerZoneItemTitle}>Reset statistics</h4>
              <p className={styles.dangerZoneItemDescription}>
                Remove all statistics data you&apos;ve accumulated so far. This action is irreversible and
                cannot be undone.
              </p>
              <button
                type="button"
                id="deleteStatsButton"
                className={`${styles.articleButton} ${styles.dangerZoneArticleButton}`}
                onClick={() => {
                  setTypeOfDeletion("stats");
                  openOrCloseDangerZonePopup();
                }}
              >
                Reset statistics
              </button>
            </div>

            <div className={styles.dangerZonePopup}>
              <input
                type="password"
                id="passwordPopupInput"
                placeholder="Enter password to confirm deletion"
                autoComplete="current-password"
                className={styles.passwordPopupInput}
              />

              <div className={styles.dangerZonePopupButtonsContainer}>
                <button
                  type="button"
                  className={`${styles.articleButton} ${styles.dangerZoneArticleButton}`}
                  onClick={() => {
                    typeOfDeletion === "account"
                      ? deleteAccountOrDeleteStats()
                      : deleteAccountOrDeleteStats(true);
                  }}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className={`${styles.articleButton} ${styles.dangerZonePopupCancelButton}`}
                  onClick={() => openOrCloseDangerZonePopup(true)}
                >
                  Cancel
                </button>
              </div>
              <span className={styles.dangerZonePopupCountdownLine}></span>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default DangerZone;
