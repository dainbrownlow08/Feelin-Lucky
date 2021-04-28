class PlayersController < ApplicationController
    def show
        player = Player.find(params[:id]) 
        render json: PlayerSerializer.new(player).serialized_json
    end

    def index
        players = Player.all
        render json: PlayerSerializer.new(players).serialized_json
    end

    def create
        player = Player.create(username: params["player"]["username"])
        if player.valid?
            render json: PlayerSerializer.new(player).serialized_json
        else
            render json: {error: 'Username must be unique.'}
        end
        
    end
end
