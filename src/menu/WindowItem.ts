const MacSpecificItem = [
  { type: "separator" },
  { role: "front" },
  { type: "separator" },
  { role: "window" },
];

const NonMacSpecificItem = [{ role: "close" }];

const MacWindowItem = {
  label: "Window",
  submenu: [{ role: "minimize" }, ...MacSpecificItem],
};

const NonMacWindowItem = {
  label: "Window",
  submenu: [{ role: "minimize" }, ...NonMacSpecificItem],
};

export { MacWindowItem, NonMacWindowItem };
