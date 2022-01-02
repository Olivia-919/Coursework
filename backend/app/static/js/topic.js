addEventLoad(function() {
  function fetchTopicServer() {
    const queryId = getQueryVariable('id');
    if (queryId === false) {
      return false;
    }
    fetch(`/api/topic?id=${queryId}`, {
      method: 'GET',
    })
      .then(r => r.json())
      .then(r => {
        if (r.success) {
          $('#topic-loading').hide();
          if (!r.data) {
            $('#topic-empty-mess').html('<div class="topic-empty">暂无主题</div>')
          } else {
            // 详情
            const { data } = r;
            const { children } = data;
            const ht = $('#topic-detail-template').html();
            const htSource = ht.replace(scriptTemplateReg, function (node, key) {
              return {
                'topicName': data.name,
                'topicDesc': data.desc,
                'topicDate': moment.utc(data.gmt_modify).format('YYYY-MM-DD HH:mm:ss'),
                'topicCreator': data.creator_id
              }[key];
            });
            $('#topic-detail-cnt').html(htSource);

            // 声明列表
            if (!Array.isArray(children) || children.length === 0) {
              $('#claims-list').html('');
            } else {
              const cardliststr = children.map(item => {
                const ht = $('#oneTopicCardTemplate').html();
                const source = ht.replace(scriptTemplateReg, function (node, key) {
                  return {
                    'claimName': item.name,
                    'claimReplyCount': 100,
                    'claimDate': moment.utc(item.gmt_modify).format('YYYY-MM-DD HH:mm:ss'),
                    'claimCreator': item.creator_id,
                    'claimContent': item.content
                  }[key];
                });
                return source;
              })
              $('#claims-list').html(cardliststr.join(''))
            }
            
            $('#topic-empty-mess').html('');
          }
          // 打开创建主题 modal
          $('#topic-empty-add').click(function () {
            $("#addTopicModal").modal();
          });
        }
      })
      .catch(error => {
        console.error(error);
        $('#topic-loading').hide();
      })
  }
  setTimeout(function () {
    fetchTopicServer();
  }, 1000)
});