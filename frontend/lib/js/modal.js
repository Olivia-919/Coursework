(function() {
  const defaultOptions = {
    // 主标题
    title: '',
    // 宽度
    width: 500,
    // 内容
    content: '',
    // 是否展示关闭按钮
    showCloseIcon: true,
  };
  const modalConfig = function(modalOptions) {
    const finalOptions = Object.assign({}, defaultOptions, modalOptions);
    
    // modal 容器
    const $modalContainer = document.createElement('div');
    $modalContainer.setAttribute('class', 'modal-container');
    
    // modal 内容区
    const $modalContent = document.createElement('div');
    $modalContent.setAttribute('class', 'modal-content');
    $modalContent.style.width = finalOptions.width + 'px';

    // modal 内容区 头部
    const $modalContentHead = document.createElement('div');
    $modalContentHead.setAttribute('class', 'modal-content-head');

    // modal 标题
    const $headTitle = document.createElement('div');
    $headTitle.setAttribute('class', 'modal-content-title');
    $headTitle.innerText = finalOptions.title;
    $modalContentHead.appendChild($headTitle);

    // 头部的关闭icon
    const $headCloseIcon = document.createElement('span');
    // <svg class="icon" aria-hidden="true">
    //   <use xlink:href="#icon-close"></use>
    // </svg>
    $headCloseIcon.setAttribute('class', 'modal-content-close');
    $headCloseIcon.innerHTML = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-close"></use></svg>';
    // 关闭icon的事件处理
    $headCloseIcon.onclick = function () {
      document.body.removeChild($modalContainer);
    };
    $modalContentHead.appendChild($headCloseIcon);

    // modal 内容区 body
    const $modalContentBody = document.createElement('div');
    $modalContentBody.setAttribute('class', 'modal-content-body');
    $modalContentBody.innerHTML = finalOptions.content;

    $modalContent.appendChild($modalContentHead);
    $modalContent.appendChild($modalContentBody);
    $modalContainer.appendChild($modalContent);
    document.body.appendChild($modalContainer);
  }
  window.modalConfig = modalConfig;
})();