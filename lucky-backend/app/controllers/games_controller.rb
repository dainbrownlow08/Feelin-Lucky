class GamesController < ApplicationController
    def index
        games = Game.topTen
        render json: games, except: [:created_at,:updated_at]
    end

    def create
        game = Game.create(score: 0, player_id: params["game"]["player_id"])
        render json: game, except: [:created_at,:updated_at]
    end
    
    def update
        game = Game.find(params["id"].to_i)
        game.update(score: params["game"]["score"])
        render json: game
    end
end

