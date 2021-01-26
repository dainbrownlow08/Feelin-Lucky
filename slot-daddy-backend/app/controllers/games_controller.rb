class GamesController < ApplicationController
    def index
        games = Game.all
        render json: games, except: [:created_at,:updated_at]
    end

    def create
        game = Game.create(score: 0, player_id: params["game"]["player_id"])
        render json: game, except: [:created_at,:updated_at]
    end
    
end
