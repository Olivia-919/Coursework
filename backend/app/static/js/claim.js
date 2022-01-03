addEventLoad(function() {
  const form = document.getElementById('addReplyForm');
  const queryId = getQueryVariable('id');
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
              const cardliststr = children.map(item => {
                const ht = $('#claim-reply-template').html();
                const source = ht.replace(scriptTemplateReg, function (node, key) {
                  return {
                    'replyId': item.id,
                    'replyContent': item.content,
                    'replyCreator': item.creator_id,
                    'replyDate': moment.utc(item.gmt_modify).format('YYYY-MM-DD HH:mm:ss'),
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
});