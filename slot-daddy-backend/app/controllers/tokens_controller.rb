class TokensController < ApplicationController
    def create
        token = Token.create(player_id: params["token"]["player_id"])
        token_count = Token.select{|t| t.player_id == params["token"]["player_id"]}.count
        render json:  token_count
    end

    def destroy
        byebug
    end
    
end
