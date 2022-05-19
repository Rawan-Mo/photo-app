from flask import Response, request
from flask_restful import Resource
import json
from models import db, Comment, Post
from views import can_view_post
from flask_jwt_extended import current_user 


class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # create a new "Comment" based on the data posted in the body 
        body = request.get_json()
        print('this is body')
        print(body)
        if not body.get('post_id'):
            return Response(json.dumps({'message': 'post id is missing'}), mimetype="application/json", status=400)

        try:
            id = int(body.get('post_id'))
        except:
            return Response(json.dumps({'message': 'post id is invalid'}), mimetype="application/json", status=400)
        
        if not can_view_post(body.get('post_id'), self.current_user):
            return Response(json.dumps({'message': 'unauthorized viewer'}), mimetype="application/json", status=404)

        new_comment = Comment(
            post_id = body.get('post_id'),
            text = body.get('text'),
            user_id= self.current_user.id, # must be a valid user_id or will throw an error
        ) 

        try:
            db.session.add(new_comment)
            db.session.commit()
        except:
            return Response(json.dumps({'message': 'comment is a duplicate'}), mimetype="application/json", status=400)

        return Response(json.dumps(new_comment.to_dict()), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    def delete(self, id):
        # delete "Comment" record where "id"=id
        print(id)
        comment = Comment.query.get(id)

        if not comment:
            return Response(json.dumps({'message': 'not found'}), mimetype="application/json", status=404)

        if comment.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'user id is invalid'}), mimetype="application/json", status=404)

        Comment.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message": "{0} was successfully deleted.".format(id)}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<int:id>', 
        '/api/comments/<int:id>/',
        resource_class_kwargs={'current_user': current_user}
    )
