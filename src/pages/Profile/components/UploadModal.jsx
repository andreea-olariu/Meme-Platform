import React, { useState } from "react"
import { InboxOutlined } from "@ant-design/icons"
import { Button, message, Upload, Modal } from "antd"
import { v4 as uuid } from "uuid"
import { auth, db, storage } from "../../../utils/firebase"

const { Dragger } = Upload

export default function UploadModal({ buttonText, database, reff }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [file, setFile] = useState()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const uploadProps = {
    fileList: file ? [file] : [],
    beforeUpload: (uploadedFile) => {
      // this is before upload
      setFile(uploadedFile)
      return false
    },
    onRemove: () => {
      setFile(null)
    },
  }

  async function onSuccess(imageUrl) {
    if (database === "memes") {
      db.collection("memes").add({
        imageUrl,
        username: auth.currentUser.displayName,
        userId: auth.currentUser.uid,
      })
    } else {
      db.collection(database).onSnapshot((snapshot) => {
        const userRecord = snapshot.docs.find(
          (doc) => doc.data().userId === auth.currentUser?.uid
        )
        db.collection(database).doc(userRecord.id).update({
          avatarUrl: imageUrl,
        })
      })
    }
  }

  const handleUpload = () => {
    const imageName = `${file.name}-${uuid()}`

    storage
      .ref(`${reff}/${imageName}`)
      .put(file)
      .then((snapshot) => {
        if (snapshot.state === "success") {
          storage
            .ref(reff)
            .child(imageName)
            .getDownloadURL()
            .then(async (downloadUrl) => {
              await onSuccess(downloadUrl)
              setIsModalOpen(false)
              setFile(null)
            })
        }
      })
      .catch((err) => message.error(`${imageName} failed to upload.`))
  }

  const handleOk = () => {
    handleUpload()
  }

  return (
    <>
      <Button onClick={showModal}>{buttonText}</Button>
      <Modal
        title={buttonText}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>
      </Modal>
    </>
  )
}
