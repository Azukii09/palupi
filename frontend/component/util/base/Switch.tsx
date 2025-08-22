import React from 'react';

const Switch = () => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" name="switch"/>
      <div className="group peer ring-0 bg-gradient-to-tr from-quaternary via-quinary to-danger rounded-full outline-none duration-300 after:duration-300 w-24 h-12 shadow-md peer-checked:bg-success peer-focus:outline-none after:content-['✖️'] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-10 after:w-10 after:top-1 after:left-1 after:-rotate-180 after:flex after:justify-center after:items-center peer-checked:after:translate-x-12 peer-checked:after:content-['✔️'] peer-hover:after:scale-95 peer-checked:after:rotate-0 peer-checked:bg-gradient-to-tr peer-checked:from-green-300 peer-checked:via-secondary/40 peer-checked:to-success">
      </div>
    </label>
  );
}

export default Switch;
