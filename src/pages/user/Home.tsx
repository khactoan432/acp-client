import React from 'react';
import { useState } from "react";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import Tooltip from "../../components/ui/Tooltip";
import Banner from '../../components/features/Banner/Banner';

const UserHome: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Banner/>
      <div className="p-8">
        {/* Tooltip */}
        <Tooltip text="Click to open modal">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Open Modal
          </button>
        </Tooltip>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Loading Example">
          <div className="flex items-center justify-center">
            {/* Spinner */}
            <Spinner size="8" color="blue-500" />
          </div>
          <p className="text-center mt-4">Loading data...</p>
        </Modal>
      </div>
    </div>
  );
}

export default UserHome