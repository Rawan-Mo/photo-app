from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json
from views import get_authorized_user_ids

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # return all of the "following" records that the current user is following
        #following_ids = get_authorized_user_ids(self.current_user)
        following = Following.query.filter(Following.user_id==self.current_user.id).all()
        print('this is following')
        print(following)
        following_json = [follower.to_dict_following() for follower in following]
        return Response(json.dumps(following_json), mimetype="application/json", status=200)

    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()
        print(body)
        return Response(json.dumps({}), mimetype="application/json", status=201)

class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "following" record where "id"=id
        print(id)
        return Response(json.dumps({}), mimetype="application/json", status=200)




def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
