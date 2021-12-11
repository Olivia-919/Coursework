(function() {
  const defaultOptions = {
    // 主标题
    title: '',
    // 宽度
    width: 500,
    // 是否展示关闭按钮
    showCloseIcon: true,
  };
  const modalConfig = function(modalOptions) {
    const finalOptions = Object.assign({}, defaultOptions, modalOptions);
    
    // modal 容器
    const modalContainer = document.createElement('div');
    modalContainer.setAttribute('class', 'modal-container');
    
    // modal 内容区
    const modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modal-content');
    modalContent.style.width = finalOptions.width + 'px';
    

    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
  }
  window.modalConfig = modalConfig;
})();