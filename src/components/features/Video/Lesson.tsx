import React, { useState } from 'react';
import Modal from 'react-modal';

// Đảm bảo root element để React Modal hoạt động chính xác
Modal.setAppElement('#root');

interface LessonProps {
  url: string | undefined; // Đường dẫn video được truyền qua props
  name: string; // Tên khóa học
}

const Lesson: React.FC<LessonProps> = ({ url }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative">
      {/* Video hiển thị */}
      <p className='text-sky-400 hover:text-sky-600 cursor-pointer' onClick={openModal}>Học thử</p>

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

export default Lesson;
