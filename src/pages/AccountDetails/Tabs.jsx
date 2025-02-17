import React from 'react';

function Tabs({ tab, setTab, tabs }) {
  return (
    <div className="flex ">
      {tabs.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => setTab(item.name)}
            className={`px-4 py-2 cursor-pointer grow text-center ${
              item.name === tab
                ? 'bg-green-600 font-bold text-white'
                : 'bg-gray-100 text-black'
            }`}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
}

export default Tabs;
