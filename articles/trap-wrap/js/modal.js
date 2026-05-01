
"use strict";
const modalData = [
    {
        trigger: "#modal-trigger",
        bg: "#modal-bg",
        modal: "#modal",
        closeBtn: "#modal-close-btn"
    },
    {
        trigger: "#modal-trigger2",
        bg: "#modal-bg2",
        modal: "#modal2",
        closeBtn: "#modal-close-btn2"
    },
    {
        trigger: "#modal-trigger3",
        bg: "#modal-bg3",
        modal: "#modal3",
        closeBtn: "#modal-close-btn3"
    }
];

modalData.forEach(function (data) {
    const trigger = document.querySelector(data.trigger);
    const bg = document.querySelector(data.bg);
    const modal = document.querySelector(data.modal);
    const closeBtn = document.querySelector(data.closeBtn);

    trigger.addEventListener("click", function () {
        bg.style.display = "block";
        setTimeout(function () {
            modal.classList.add("show");
            bg.classList.add("show");
        }, 50);
    });

    modal.addEventListener("click", function () {
        modal.classList.remove("show");
        bg.classList.remove("show");
        setTimeout(function () {
            bg.style.display = "none";
        }, 300);
    });

    bg.addEventListener("click", function (e) {
        if (e.target === bg || e.target === closeBtn) {
            modal.classList.remove("show");
            bg.classList.remove("show");
            setTimeout(function () {
                bg.style.display = "none";
            }, 300);
        }
    });

    closeBtn.addEventListener("click", function () {
        modal.classList.remove("show");
        bg.classList.remove("show");
        setTimeout(function () {
            bg.style.display = "none";
        }, 300);
    });
});
