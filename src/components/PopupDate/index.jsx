import React, { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { Popup, DatePicker } from "antd-mobile";
import dayjs from "dayjs";

const PopupDate = forwardRef(({ onSelect, mode = "day" }, ref) => {
  const [show, setShow] = useState(false);
  const [now, setNow] = useState(new Date());

  const choseMonth = (item) => {
    setNow(item);
    setShow(false);
    if (mode == "month") {
      onSelect(dayjs(item).format("YYYY-MM"));
    } else if (mode == "day") {
      onSelect(dayjs(item).format("YYYY-MM-DD"));
    }
  };

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      },
    };
  }
  return (
    <Popup
      visible={show}
      position="bottom"
      mask={false}
      onMaskClick={() => setShow(false)}
      getContainer={() => document.body}
    >
      <div>
        <DatePicker
          visible={show}
          value={now}
          precision={mode}
          onConfirm={choseMonth}
          onCancel={() => setShow(false)}
        />
      </div>
    </Popup>
  );
});

PopupDate.propTypes = {
  mode: PropTypes.string, // 日期模式
  onSelect: PropTypes.func, // 选择后的回调
};

export default PopupDate;
