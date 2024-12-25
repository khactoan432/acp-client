import React, { useState } from 'react';
import Modal from 'react-modal';

// Đảm bảo root element để React Modal hoạt động chính xác
Modal.setAppElement('#root');

interface VideoPopupProps {
  url: string | undefined; // Đường dẫn video được truyền qua props
  name: string; // Tên khóa học
}

const VideoPopup: React.FC<VideoPopupProps> = ({ url, name }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative">
      {/* Video hiển thị */}
      <div className="relative cursor-pointer" onClick={openModal}>
        <video
          className="rounded-md w-full h-[180px] object-cover"
          src={url}
          controls={false} // Không hiển thị controls trong video ban đầu
          muted // Tắt âm thanh
        />
        {/* Nút Play */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div
            className="bg-white bg-opacity-80 w-16 h-16 rounded-full flex justify-center items-center shadow-lg hover:bg-opacity-100 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-black"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M6.271 4.055a.5.5 0 0 0-.771.422v7.046a.5.5 0 0 0 .771.422l6.482-3.523a.5.5 0 0 0 0-.844L6.271 4.055z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Video Popup"
        overlayClassName="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
        className="rounded-lg w-full h-full mx-auto shadow-lg outline-none p-6 relative"
      >
        {/* Nút đóng modal */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white hover:text-gray-200 text-4xl"
        >
          &times;
        </button>
        {/* Video trong modal */}
        <div className="h-full flex justify-center items-center">
          <video
            className="rounded-md max-w-[1024px] mx-auto my-auto"
            src={url}
            controls
            autoPlay // Tự động phát video khi mở modal
          />
        </div>
      </Modal>
    </div>
  );
};

export default VideoPopup;
