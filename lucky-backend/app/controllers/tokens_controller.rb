class TokensController < ApplicationController
    def create
        token = Token.create(player_id: params["token"]["player_id"])
        token_count = Token.select{|t| t.player_id == params["token"]["player_id"]}.count
        bigtoken = {token: token, token_count: token_count}
        render json:  bigtoken
    end

    def destroy
        Token.find(params[:id]).destroy
        render json: {message: 'token deleted'}
    end
    
end
