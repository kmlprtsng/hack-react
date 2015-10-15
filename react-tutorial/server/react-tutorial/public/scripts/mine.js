 var CommentBox = React.createClass({
    getInitialState: function(){
      return{
        data: [];
      }
    },

    render: function(){
      return(
        <div className="commentBox">
          <h2>Comment box</h2>
          <CommentList data={this.state.data} />
          <CommentForm />
        </div>
      );
    }
});

var CommentList = React.createClass({
    render: function(){
          var commentNodes = this.props.data.map(function (comment, i) {
      return (
        <Comment author={comment.author} key={i}>
          {comment.text}
        </Comment>
      );
    });

      return(
        <div className="commentList">
            {commentNodes}
        </div>
      );
    }
});

var CommentForm = React.createClass({
  render: function(){
    return(
      <div className="commentForm">
          Hello, Im a comment form
      </div>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function(){
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return {__html: rawMarkup};
  },

  render: function(){
    return(
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox url="/api/comments" />,
  document.getElementById('content')
);