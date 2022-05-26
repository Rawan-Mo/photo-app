from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json
from views import get_authorized_user_ids
import flask_jwt_extended


def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        # return all of the "following" records that the current user is following
        #following_ids = get_authorized_user_ids(self.current_user)
        following = Following.query.filter(Following.user_id==self.current_user.id).all()
        print('this is following')
        print(following)
        following_json = [follower.to_dict_following() for follower in following]
        return Response(json.dumps(following_json), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()
        if not body.get('user_id'):
            return Response(json.dumps({'message': 'user id is missing'}), mimetype="application/json", status=400)

        try:
            id = int(body.get('user_id'))
        except:
            return Response(json.dumps({'message': 'user id is invalid'}), mimetype="application/json", status=400)
        
        if not User.query.get(id):
            return Response(json.dumps({'message': 'user id is invalid'}), mimetype="application/json", status=404)

        new_following = Following(
            self.current_user.id,
            body.get('user_id')
        )

        try:
            db.session.add(new_following)
            db.session.commit()
        except:
            return Response(json.dumps({'message': 'following is duplicated'}), mimetype="application/json", status=400)

        return Response(json.dumps(new_following.to_dict_following()), mimetype="application/json", status=201)

class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # delete "following" record where "id"=id
        following = Following.query.get(id)

        if not following:
            return Response(json.dumps({'message': 'not found'}), mimetype="application/json", status=404) #check if this is 404 or 400

        if following.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'user id is invalid'}), mimetype="application/json", status=404)

        Following.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message": "{0} was successfully deleted.".format(id)}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
