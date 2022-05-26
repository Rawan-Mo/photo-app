from flask import Response, request
from flask_restful import Resource
from models import Post, db, Following
from views import get_authorized_user_ids
from flask_jwt_extended import current_user 


import json

def get_path():
    return request.host_url + 'api/posts/'

class PostListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def get(self):  #HTTP GET
        args = request.args 
        print(args)
        # # Goal: limit to only user #12 (current_user)'s network
        # #   - oneself
        # #   - ppl #12 are following

        # # 1. Query the following table to get the user_ids that #12 is following:
        # user_ids_tuples = (
        #     db.session
        #         .query(Following.following_id)
        #         .filter(Following.user_id == self.current_user.id)
        #         .order_by(Following.following_id)
        #         .all()
        #     )
        # print(user_ids_tuples)
        # user_ids = [id for (id,) in user_ids_tuples]
        # print(user_ids)
        # user_ids.append(self.current_user.id)

        # alternative method
        # It is getting all the user_ids that the current user is 
        # following, and then adding the current user's id to the list.
        # this list of user ids is then used to query the posts table

        user_ids = get_authorized_user_ids(self.current_user)

        try:
            limit = int(args.get('limit') or 20) # 20 is the default
            # print(type(limit))
        except:
            # could not convert to int
            return Response(json.dumps({'message': 'the limit parameter is invalid'}), mimetype="application/json", status=400)
        if limit > 50:
            # too big
            return Response(json.dumps({'message': 'the limit parameter is invalid'}), mimetype="application/json", status=400)
        #posts = Post.query.limit(limit).all()
        posts = Post.query.filter(Post.user_id.in_(user_ids)).limit(limit).all()
        data = [post.to_dict(user=self.current_user) for post in posts]
        return Response(json.dumps(data), mimetype="application/json", status=200)
    
    @flask_jwt_extended.jwt_required()
    def post(self):   #HTTP POST
        # create a new post based on the data posted in the body 
        body = request.get_json()

        if not body.get('image_url'):
            return Response(json.dumps({'message': "'image_url' is required"}), mimetype="application/json", status=400)
        # insert whatever was posted in the body into the database
        new_post = Post(
            image_url= body.get('image_url'),
            user_id= self.current_user.id, # must be a valid user_id or will throw an error
            caption=body.get('caption'),
            alt_text= body.get('alt_text')
        )
        db.session.add(new_post)    # issues the insert statement
        db.session.commit()   
        return Response(json.dumps(new_post.to_dict()), mimetype="application/json", status=201)
        
class PostDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
        
    @flask_jwt_extended.jwt_required()
    def patch(self, id):
        # update post based on the data posted in the body 
        body = request.get_json()

        # 1. Retrieve the existing post from the database
        post = Post.query.get(id)
        if not post:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)

        # 2. Check if the current user is the owner of the post
        if post.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)
            
        # 2. set the new values (only if requested)
        if body.get('image_url'):
            post.image_url = body.get('image_url')
        if body.get('caption'):
            post.caption = body.get('caption')
        if body.get('alt_text'):
            post.alt_text = body.get('alt_text')

        # 3. commit the changes to the database
        db.session.commit()
        return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        post = Post.query.get(id)
        if not post:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)
        
        # you shouldn't be able to delete a post that is not yours
        if post.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)
        
        # delete post where "id"=id
        Post.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps({"message": "Post id={0} was successfully deleted.".format(id)}), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    def get(self, id):
        # we need to query the posts table to get the post with the id
        post = Post.query.get(id)
        if not post:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)
        
        # these are the users the current user is connected to
        user_ids = get_authorized_user_ids(self.current_user)
        # if the current user is not connected to the post, then return a 404
        if post.user_id not in user_ids:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)
            
        return Response(json.dumps(post.to_dict(user=self.current_user)), mimetype="application/json", status=200)

def initialize_routes(api):
    api.add_resource(
        PostListEndpoint, 
        '/api/posts', '/api/posts/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
    api.add_resource(
        PostDetailEndpoint, 
        '/api/posts/<int:id>', '/api/posts/<int:id>/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )