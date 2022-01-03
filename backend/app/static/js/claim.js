addEventLoad(function() {
  const form = document.getElementById('addReplyForm');
  const queryId = getQueryVariable('id');
  let isAddPrevLink = false;
  function fetchTopicServer() {
    if (queryId === false) {
      return false;
    }
    fetch(`/api/claim?id=${queryId}`, {
      method: 'GET',
    })
      .then(r => r.json())
      .then(r => {
        if (r.success) {
          $('#claim-loading').hide();
          if (!r.data) {
            $('#claim-empty-mess').html('<div class="topic-empty">暂无数据</div>')
          } else {
            $('#add-reply-btn').show();
            // 详情
            const { data } = r;
            const { children } = data;
            if (!isAddPrevLink) {
              $('#claim-nav-index').after(`<li class="breadcrumb-item"><a href="/topic?id=${data.topic_id}">主题</a></li>`)
            }
            isAddPrevLink = true;
            $('#topicId').val(data.topic_id);
            const ht = $('#claim-detail-template').html();
            const htSource = ht.replace(scriptTemplateReg, function (node, key) {
              return {
                'claimName': data.name,
                'claimContent': data.content,
                'claimDate': moment.utc(data.gmt_modify).format('YYYY-MM-DD HH:mm:ss'),
                'claimCreator': data.creator_id
              }[key];
            });
            $('#claim-detail-cnt').html(htSource);

            // 评论列表
            if (!Array.isArray(children) || children.length === 0) {
              $('#reply-list').html('');
            } else {
              const cardliststr = children.map((item, index) => {
                const ht = $('#claim-reply-template').html();
                const source = ht.replace(scriptTemplateReg, function (node, key) {
                  return {
                    'replyIndex': index,
                    'replyId': item.id,
                    'replyContent': item.content,
                    'replyCreator': item.creator_id,
                    'replyDate': moment.utc(item.gmt_modify).format('YYYY-MM-DD HH:mm:ss')
                  }[key];
                });
                return source;
              })
              $('#reply-list').html(cardliststr.join(''))
            }
            
            $('#claim-empty-mess').html('');
          }
        }
      })
      .catch(error => {
        console.error(error);
        $('#claim-loading').hide();
      })
  }
  setTimeout(function () {
    fetchTopicServer();
  }, 500)

  // 登录表单校验
  function validateForm() {
    return new Promise((resolve, reject) => {
      let flag = true;
      if (form.checkValidity() === false) {
        flag = false;
      }
      form.classList.add('was-validated');
      const nameVal = $("#reply-cnt").val();
      if (nameVal) {
        $("#reply-cnt").removeClass("is-invalid");
      } else {
        $("#reply-cnt").addClass("is-invalid");
        flag = false;
      }
      if (flag) {
        resolve();
      } else {
        reject();
      }
    });
  }
  // 发表声明表单
  $("#addReplySubmitBtn").click((e) => {
    e.preventDefault();
    validateForm().then(() => {
      $("#addReplySubmitBtn").attr("disabled", true);
      $("#reply-submit-loading").css("display", "inline-block");
      const f = new FormData(form);
      // 声明ID
      f.set('claimId', queryId);
      f.set('topicId', $('#topicId').val());
      fetch("/api/addReply", {
        method: "POST",
        body: f,
        headers: {
          "X-CSRFToken": _token,
        },
      })
      .then((r) => r.json())
      .then(r => {
        $("#reply-submit-loading").css("display", "none");
        // $("#addTopicSubmitBtn").attr("disabled", false);
        if (r.success) {
          $('#addReply-feedback').html(`<div class="alert alert-success" role="alert">保存成功，自动关闭此弹窗...</div>`);
          setTimeout(() => {
            $("#addReplyModal").modal('hide');
            fetchTopicServer();
          }, 500)

        } else {
          $('#addReply-feedback').html(`<div class="alert alert-danger" role="alert">${r.message}</div>`);
        }
      })
    });
  });

  function loadReplyReplyServer(recipient) {
    fetch(`/api/reply?id=${recipient}`, {
      method: 'GET'
    })
      .then(r => r.json())
      .then(r => {
        if (r.success) {
          const { data } = r;
          const { children } = data;
          if (Array.isArray(children) && children.length > 0) {
            const cardliststr = children.map((item, index) => {
              const ht = $('#look-reply-detail-template').html();
              const source = ht.replace(scriptTemplateReg, function (node, key) {
                return {
                  'replyContent': item.content,
                  'replyDate': moment.utc(item.gmt_modify).format('YYYY-MM-DD HH:mm:ss'),
                  'replyPerson': item.creator_id,
                  'replyReplyPerson': item.reply_person_id,
                  'index': index,
                  'replyId': item.id,
                }[key];
              });
              return source;
            })
            $('#reply-reply-list-wrap').html(cardliststr.join(''))
          } else {
            $('#reply-reply-list-wrap').html('<div class="alert alert-primary" role="alert">暂无回复</div>');
          }
        } else {
          
        }
      })
  }

  // 查看回复Modal
  $('#lookReplyModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget)
    const recipient = button.data('whatever')
    // var modal = $(this)
    // modal.find('.modal-title').text('New message to ' + recipient)
    // modal.find('.modal-body input').val(recipient)
    // 请求评论详情
    if (recipient !== null && recipient !== undefined) {
      $('#reply-reply-id').val(recipient)
      loadReplyReplyServer(recipient);
    }
  })

  $('#lookReplyModal').on('hidden.bs.modal', function() {
    $('#reply-reply-list-wrap').html('');
  })

  // 发表评论Modal
  $("#addReplyModal").on("hidden.bs.modal", function (e) {
    // 清空表单
    $("#reply-cnt").val("");
    $("#reply-cnt").removeClass("is-invalid");
    $('#addReply-feedback').html('');
    $("#addReplySubmitBtn").attr("disabled", false);
  });
  $('#add-reply-btn').click(function() {
    $("#addReplyModal").modal();
  });


  function validateReplyForm() {
    const formReply = document.getElementById('addReplyReplyForm');
    return new Promise((resolve, reject) => {
      let flag = true;
      if (formReply.checkValidity() === false) {
        flag = false;
      }
      formReply.classList.add('was-validated');
      const nameVal = $("#reply-reply-cnt").val();
      if (nameVal) {
        $("#reply-reply-cnt").removeClass("is-invalid");
      } else {
        $("#reply-reply-cnt").addClass("is-invalid");
        flag = false;
      }
      if (flag) {
        resolve();
      } else {
        reject();
      }
    });
  }
  $('#add-reply-reply-btn').click(function(e) {
    e.preventDefault();
    validateReplyForm().then(() => {
      $("#add-reply-reply-btn").attr("disabled", true);
      $("#reply-reply-submit-loading").css("display", "inline-block");
      const formReply = document.getElementById('addReplyReplyForm');
      const f = new FormData(formReply);
      // 声明ID
      f.set('claimId', queryId);
      f.set('topicId', $('#topicId').val());
      setTimeout(function() {
        fetch("/api/addReply", {
          method: "POST",
          body: f,
          headers: {
            "X-CSRFToken": _token,
          },
        })
        .then((r) => r.json())
        .then(r => {
          $("#reply-reply-submit-loading").hide();
          $("#add-reply-reply-btn").attr("disabled", false);
          if (r.success) {
            loadReplyReplyServer($('#reply-reply-id').val());
          } else {
            $('#addReply-feedback').html(`<div class="alert alert-danger" role="alert">${r.message}</div>`);
          }
        })
      }, 500)
    });
  });

  window.submitReplyReply = function(index) {
    function vf () {
      const formReply = document.getElementById(`addReplyReplyForm-${index}`);
      return new Promise((resolve, reject) => {
        let flag = true;
        if (formReply.checkValidity() === false) {
          flag = false;
        }
        formReply.classList.add('was-validated');
        const nameVal = $(`#reply-reply-cnt-${index}`).val();
        if (nameVal) {
          $(`#reply-reply-cnt-${index}`).removeClass("is-invalid");
        } else {
          $(`#reply-reply-cnt-${index}`).addClass("is-invalid");
          flag = false;
        }
        if (flag) {
          resolve();
        } else {
          reject();
        }
      });
    }
    vf().then(() => {
      $(`#add-reply-reply-btn-${index}`).attr("disabled", true);
      $(`#reply-reply-submit-loading-${index}`).css("display", "inline-block");
      const formReply = document.getElementById(`addReplyReplyForm-${index}`);
      const f = new FormData(formReply);
      // 声明ID
      f.set('claimId', queryId);
      f.set('topicId', $('#topicId').val());
      setTimeout(function() {
        fetch("/api/addReply", {
          method: "POST",
          body: f,
          headers: {
            "X-CSRFToken": _token,
          },
        })
        .then((r) => r.json())
        .then(r => {
          $(`#reply-reply-submit-loading-${index}`).hide();
          $(`#add-reply-reply-btn-${index}`).attr("disabled", false);
          if (r.success) {
            loadReplyReplyServer($('#reply-reply-id').val());
          } else {
            // $('#addReply-feedback').html(`<div class="alert alert-danger" role="alert">${r.message}</div>`);
          }
        })
      }, 500)
    });
  }
});