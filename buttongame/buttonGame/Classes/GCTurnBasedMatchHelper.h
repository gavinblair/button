#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>
#import <GameKit/GameKit.h>

@protocol GCTurnBasedMatchHelperDelegate
- (void)enterNewGame:(GKTurnBasedMatch *)match;
- (void)layoutMatch:(GKTurnBasedMatch *)match;
- (void)takeTurn:(GKTurnBasedMatch *)match;
- (void)recieveEndGame:(GKTurnBasedMatch *)match;
- (void)sendNotice:(NSString *)notice 
  forMatch:(GKTurnBasedMatch *)match;
@end

@interface GCTurnBasedMatchHelper : CDVPlugin <GKTurnBasedMatchmakerViewControllerDelegate, 
  GKTurnBasedEventHandlerDelegate> {

    BOOL gameCenterAvailable;
    BOOL userAuthenticated;
    UIViewController *presentingViewController;
 
    GKTurnBasedMatch *currentMatch;
 
    id <GCTurnBasedMatchHelperDelegate> delegate;
}

 
@property (nonatomic, retain) 
  id <GCTurnBasedMatchHelperDelegate> delegate;
@property (assign, readonly) BOOL gameCenterAvailable;
@property (nonatomic, retain) GKTurnBasedMatch *currentMatch;
 
+ (GCTurnBasedMatchHelper *)sharedInstance;
- (void)authenticateLocalUser;
- (void)authenticationChanged;
- (void)findMatchWithMinPlayers:(int)minPlayers maxPlayers:(int)maxPlayers viewController:(UIViewController *)viewController;
 
@end