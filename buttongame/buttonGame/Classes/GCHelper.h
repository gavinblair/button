//
//  GCHelper.h
//  buttonGame
//
//  Created by podcast on 13-03-05.
//
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>
#import <GameKit/GameKit.h>

@protocol GCHelperDelegate
- (void)matchHasStarted;
- (void)matchEnded;
- (void)match:(GKMatch *)match didReceiveData:(NSData *)data
   fromPlayer:(NSString *)playerID;
@end

@interface GCHelper : CDVPlugin <GKMatchmakerViewControllerDelegate, GKMatchDelegate> {
    BOOL gameCenterAvailable;
    BOOL userAuthenticated;
    
    UIViewController *presentingViewController;
    GKMatch *match;
    BOOL matchStarted;
    id <GCHelperDelegate> delegate;
    
    NSMutableDictionary *playersDict;
    
    NSString *otherPlayerID;
    
    BOOL isPlayer1;
    
}

@property (retain) UIViewController *presentingViewController;
@property (retain) GKMatch *match;
@property (assign) id <GCHelperDelegate> delegate;
@property (assign, readonly) BOOL userAuthenticated;

- (void)findMatchWithMinPlayers:(int)minPlayers maxPlayers:(int)maxPlayers
                 viewController:(UIViewController *)viewController
                       delegate:(id<GCHelperDelegate>)theDelegate;

@property (assign, readonly) BOOL gameCenterAvailable;
@property (assign, readonly) BOOL matchStarted;

@property (retain) NSMutableDictionary *playersDict;

+ (GCHelper *)sharedInstance;
- (void)authenticateLocalUser;

- (void)getMatch:(CDVInvokedUrlCommand*)command;
- (void)getMessage:(CDVInvokedUrlCommand*)command;

@end
