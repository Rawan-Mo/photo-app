from flask import Response, request
from flask_restful import Resource
from models import Following, db
import json
from views import get_authorized_user_ids


def get_path():
    return request.host_url + 'api/posts/'

class FollowerListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        user_ids = get_authorized_user_ids(self.current_user)
        '''
        People who are following the current user.
        In other words, select user_id where following_id = current_user.id
        '''

        user_ids_tuples = ( #people I'm FOLLOWING.. who is following me?
            db.session
                .query(Following.following_id)
                .filter(Following.following_id == self.current_user.id)
                .order_by(Following.following_id)
                .all()
            )
        print(user_ids_tuples)
        user_ids = [id for (id,) in user_ids_tuples]
        print(user_ids)
        followers_json = [follower.to_dict() for follower in user_ids]
        # user_ids.append(self.current_user.id)
        # posts = Post.query.filter(Post.user_id.in_(user_ids)).limit(limit).all()
        # posts_json = [post.to_dict() for post in posts]

        return Response(json.dumps([followers_json]), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        FollowerListEndpoint, 
        '/api/followers', 
        '/api/followers/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
